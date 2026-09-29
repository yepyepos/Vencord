/**
 * Owner fetch logic tests, run with: pnpm testServerOwner
 * Covers the ServerInfo owner-loading states (cases A-F of the fix spec).
 */

import assert from "node:assert";

import { fetchOwnerWithTimeout } from "../src/plugins/serverInfo/ownerFetcher";

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

    console.log(`\n${passed} passed, ${failed} failed`);
    if (failed > 0) process.exit(1);
}

main();
