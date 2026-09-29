/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vencord zh-CN contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Owner fetching logic for ServerInfo, kept free of webpack/Discord imports so
 * it is unit-testable in Node (scripts/test-server-owner.ts).
 *
 * Why this exists: Discord's UserUtils.getUser promise may never settle when
 * the user fetch fails silently (observed with owners that are not in the
 * member cache of large guilds), and it resolves with a falsy value when the
 * user cannot be fetched at all. The old useAwaiter-based code therefore showed
 * "Loading..." forever in those cases.
 */

export type OwnerFetchErrorReason = "rejected" | "not-found" | "timeout" | "missing-id";

export type OwnerFetchResult<T> =
    | { status: "success"; user: T; }
    | { status: "error"; reason: OwnerFetchErrorReason; };

/** How long to wait for UserUtils.getUser before giving up and showing an error + retry. */
export const OWNER_FETCH_TIMEOUT_MS = 8000;

/**
 * Fetch a user by id with timeout and total failure handling.
 * Never throws, never stays pending longer than timeoutMs, and settles exactly once.
 */
export function fetchOwnerWithTimeout<T>(
    getUser: (userId: string) => Promise<T>,
    ownerId: string | undefined,
    timeoutMs: number = OWNER_FETCH_TIMEOUT_MS
): Promise<OwnerFetchResult<T>> {
    if (!ownerId)
        return Promise.resolve({ status: "error", reason: "missing-id" });

    return new Promise(resolve => {
        let settled = false;
        const settle = (result: OwnerFetchResult<T>) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(result);
        };

        const timer = setTimeout(() => settle({ status: "error", reason: "timeout" }), timeoutMs);

        getUser(ownerId).then(
            user => settle(user ? { status: "success", user } : { status: "error", reason: "not-found" }),
            () => settle({ status: "error", reason: "rejected" })
        );
    });
}

/**
 * Final display state for the Server Owner field.
 *
 * - success:     a full User object is available -> render the Owner card
 * - fallback:    the owner user could not be fetched (rejected/timeout/not-found),
 *                but the owner id itself is known -> show the id + Copy ID + Retry
 * - unavailable: there is no ownerId at all -> nothing reliable to show
 * - loading:     no user yet and no fetch result yet (fetch in flight)
 */
export type OwnerDisplayState<T> =
    | { kind: "success"; user: T; }
    | { kind: "fallback"; ownerId: string; }
    | { kind: "unavailable" }
    | { kind: "loading" };

/**
 * Pure state resolution for the Server Owner field. The component passes the
 * already-resolved display user (cache first, then fetch result); this function
 * decides which of the four states the UI must render. Pure: Node-testable.
 */
export function resolveOwnerDisplay<T>(
    ownerId: string | undefined,
    user: T | null | undefined,
    fetchResult: OwnerFetchResult<T> | null
): OwnerDisplayState<T> {
    if (user) return { kind: "success", user };
    // no ownerId -> nothing reliable to show, even after a fetch attempt
    if (!ownerId) return { kind: "unavailable" };
    // fetch still in flight (result not set yet) -> keep the loading state
    if (!fetchResult) return { kind: "loading" };
    // fetch attempted and failed (rejected / timeout / not-found):
    // the owner id itself is still a certain, useful piece of information
    return { kind: "fallback", ownerId };
}

export interface OwnerFetchOptions {
    /** Per-attempt deadline in ms (default 8s). */
    timeoutMs?: number;
    /** Total attempts including the first (default 2: one automatic retry). */
    maxAttempts?: number;
    /** Delay between attempts in ms (default 1s). */
    retryDelayMs?: number;
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Full owner acquisition: bounded attempts on top of fetchOwnerWithTimeout.
 *
 * Only immediate rejections are retried automatically — they are the
 * transient-failure signature. Timeouts already consumed their whole deadline
 * (retrying would double user-visible latency for an uncertain gain), and
 * not-found / missing-id are deterministic results. Never retries more than
 * maxAttempts - 1 times, never throws.
 */
export async function getServerOwner<T>(
    getUser: (userId: string) => Promise<T>,
    ownerId: string | undefined,
    opts?: OwnerFetchOptions
): Promise<OwnerFetchResult<T>> {
    const { timeoutMs = OWNER_FETCH_TIMEOUT_MS, maxAttempts = 2, retryDelayMs = 1000 } = opts ?? {};

    let result = await fetchOwnerWithTimeout(getUser, ownerId, timeoutMs);
    let attempt = 1;

    while (result.status === "error" && result.reason === "rejected" && attempt < maxAttempts) {
        await sleep(retryDelayMs);
        result = await fetchOwnerWithTimeout(getUser, ownerId, timeoutMs);
        attempt++;
    }

    return result;
}
