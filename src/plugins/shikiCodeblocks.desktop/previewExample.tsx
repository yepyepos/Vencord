/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { t } from "@i18n";
import React from "react";

const handleClick = async () =>
    console.log((await import("@utils/clipboard")).copyToClipboard("\u200b"));

export const Example: React.FC<{
    real: boolean,
    shigged?: number,
}> = ({ real, shigged }) => <>
    <p>{`Shigg${real ? `ies${shigged === 0x1B ? "t" : ""}` : "y"}`}</p>
    <button onClick={handleClick}>{t("plugin.ShikiCodeblocks.preview.clickMe", "Click Me")}</button>
</>;
