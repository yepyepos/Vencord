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
