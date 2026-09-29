/**
 * Owner fetch logic tests, run with: pnpm testServerOwner
 * Covers the ServerInfo owner-loading states (cases A-F of the fix spec).
 */

import assert from "node:assert";

import { fetchOwnerWithTimeout, getServerOwner, resolveOwnerDisplay } from "../src/plugins/serverInfo/ownerFetcher";

interface FakeUser {
    id: string;
    username: string;
}

const fakeUser: FakeUser = { id: "42", username: "Owner" };

let passed = 0;
let failed = 0;

function test(name: string, fn: () => Promise<void>) {
    return fn().then(() => {
        passed++;
        console.log(`  ok  ${name}`);
    }, e => {
        failed++;
        console.error(`FAIL  ${name}`);
        console.error(e);
    });
}

async function main() {
    // Case A: cached / instant user -> success (the component skips the fetch
    // entirely in this case; the helper is still verified for direct hits)
    await test("A: cached owner (getUser resolves immediately) -> success", async () => {
        const result = await fetchOwnerWithTimeout(() => Promise.resolve(fakeUser), "42");
        assert.deepStrictEqual(result, { status: "success", user: fakeUser });
    });

    // Case B: stores empty first, fetch returns later -> success (delayed resolve)
    await test("B: uncached owner (getUser resolves after a delay) -> success", async () => {
        const result = await fetchOwnerWithTimeout(
            () => new Promise<FakeUser>(resolve => setTimeout(() => resolve(fakeUser), 20)),
            "42",
            1000
        );
        assert.deepStrictEqual(result, { status: "success", user: fakeUser });
    });

    // Case C: fetch succeeds -> success
    await test("C: getUser succeeds -> success", async () => {
        const result = await fetchOwnerWithTimeout(() => Promise.resolve(fakeUser), "42");
        assert.strictEqual(result.status, "success");
    });

    // Case D: getUser rejects -> error(rejected)
    await test("D: getUser rejects -> error(rejected)", async () => {
        const result = await fetchOwnerWithTimeout(() => Promise.reject(new Error("boom")), "42");
        assert.deepStrictEqual(result, { status: "error", reason: "rejected" });
    });

    // Case E: getUser never settles -> error(timeout), within the timeout window
    await test("E: getUser never resolves -> error(timeout)", async () => {
        const start = Date.now();
        const result = await fetchOwnerWithTimeout(
            () => new Promise<FakeUser>(() => { /* never settles */ }),
            "42",
            50
        );
        assert.deepStrictEqual(result, { status: "error", reason: "timeout" });
        assert.ok(Date.now() - start < 500, "timeout must fire at the configured deadline, not hang");
    });

    // Case F: missing/invalid ownerId -> error(missing-id), synchronously
    await test("F: missing ownerId -> error(missing-id)", async () => {
        const result = await fetchOwnerWithTimeout(() => Promise.resolve(fakeUser), undefined);
        assert.deepStrictEqual(result, { status: "error", reason: "missing-id" });
    });

    // falsy resolve (user cannot be fetched at all) -> error(not-found)
    await test("getUser resolves null -> error(not-found)", async () => {
        const result = await fetchOwnerWithTimeout(() => Promise.resolve(null), "42");
        assert.deepStrictEqual(result, { status: "error", reason: "not-found" });
    });

    // settle-once semantics: a late rejection after success must not overwrite the result
    await test("late rejection after success does not overwrite the result", async () => {
        const result = await fetchOwnerWithTimeout(
            () => new Promise<FakeUser>((resolve, reject) => {
                setTimeout(() => resolve(fakeUser), 10);
                setTimeout(() => reject(new Error("late boom")), 30);
            }),
            "42",
            1000
        );
        assert.deepStrictEqual(result, { status: "success", user: fakeUser });
    });

    // ---- display state machine (Phase 5.2.2: owner id fallback) ----

    function assertDisplay(state: ReturnType<typeof resolveOwnerDisplay<unknown>>, kind: string) {
        assert.strictEqual(state.kind, kind);
    }

    await test("display: user present -> success (Case A/B)", async () => {
        assertDisplay(resolveOwnerDisplay("42", fakeUser, null), "success");
        assertDisplay(resolveOwnerDisplay("42", fakeUser, { status: "error", reason: "timeout" }), "success");
    });

    await test("display: fetch error + ownerId exists -> fallback (Case C/D)", async () => {
        assertDisplay(resolveOwnerDisplay("42", null, { status: "error", reason: "rejected" }), "fallback");
        assertDisplay(resolveOwnerDisplay("42", null, { status: "error", reason: "timeout" }), "fallback");
        assertDisplay(resolveOwnerDisplay("42", null, { status: "error", reason: "not-found" }), "fallback");
    });

    await test("display: fallback carries the raw owner id verbatim", async () => {
        const raw = "123456789012345678";
        const state = resolveOwnerDisplay(raw, null, { status: "error", reason: "timeout" });
        assert.deepStrictEqual(state, { kind: "fallback", ownerId: raw });
    });

    await test("display: no fetch result yet -> loading", async () => {
        assertDisplay(resolveOwnerDisplay("42", null, null), "loading");
    });

    await test("display: missing ownerId -> unavailable even after fetch error (Case E)", async () => {
        assertDisplay(resolveOwnerDisplay(undefined, null, { status: "error", reason: "rejected" }), "unavailable");
        assertDisplay(resolveOwnerDisplay(undefined, null, null), "unavailable");
    });

    // ---- bounded automatic retry (getServerOwner) ----

    await test("retry: immediate rejection is retried once and succeeds", async () => {
        let calls = 0;
        const result = await getServerOwner(
            () => {
                calls++;
                return calls === 1 ? Promise.reject(new Error("transient")) : Promise.resolve(fakeUser);
            },
            "42",
            { retryDelayMs: 10 }
        );
        assert.deepStrictEqual(result, { status: "success", user: fakeUser });
        assert.strictEqual(calls, 2);
    });

    await test("retry: persistent rejection stops at maxAttempts (no infinite loop)", async () => {
        let calls = 0;
        const result = await getServerOwner(
            () => {
                calls++;
                return Promise.reject(new Error("down"));
            },
            "42",
            { retryDelayMs: 10, maxAttempts: 2 }
        );
        assert.deepStrictEqual(result, { status: "error", reason: "rejected" });
        assert.strictEqual(calls, 2);
    });

    await test("retry: timeout is NOT auto-retried (hanging getUser called exactly once)", async () => {
        let calls = 0;
        const result = await getServerOwner(
            () => {
                calls++;
                return new Promise<FakeUser>(() => { /* hangs */ });
            },
            "42",
            { timeoutMs: 40, maxAttempts: 3, retryDelayMs: 5 }
        );
        assert.deepStrictEqual(result, { status: "error", reason: "timeout" });
        assert.strictEqual(calls, 1);
    });

    await test("retry: missing ownerId never calls getUser", async () => {
        let calls = 0;
        const result = await getServerOwner(
            () => { calls++; return Promise.resolve(fakeUser); },
            undefined,
            { maxAttempts: 3 }
        );
        assert.deepStrictEqual(result, { status: "error", reason: "missing-id" });
        assert.strictEqual(calls, 0);
    });

    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

main();
