/*
 * Vencord, a Discord client mod
 * Copyright (c) 2025 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { t } from "@i18n";
import { IS_MAC } from "@utils/constants";
import { Margins } from "@utils/margins";
import { identity } from "@utils/misc";
import { Forms, Select } from "@webpack/common";

export function MacOSVibrancySettings() {
    const settings = useSettings(["macosVibrancyStyle"]);

    if (!IS_MAC || IS_WEB) return null;

    return (
        <ErrorBoundary noop>
            <Forms.FormTitle tag="h5">{t("ui.vencord.macVibrancy.heading", "MacOS Window vibrancy style (requires restart)")}</Forms.FormTitle>
            <Select
                className={Margins.bottom20}
                placeholder={t("ui.vencord.macVibrancy.placeholder", "Window vibrancy style")}
                options={[
                    // Sorted from most opaque to most transparent
                    {
                        label: t("ui.vencord.macVibrancy.noVibrancy", "No vibrancy"), value: undefined
                    },
                    {
                        label: t("ui.vencord.macVibrancy.underPage", "Under Page (window tinting)"),
                        value: "under-page"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.content", "Content"),
                        value: "content"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.window", "Window"),
                        value: "window"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.selection", "Selection"),
                        value: "selection"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.titlebar", "Titlebar"),
                        value: "titlebar"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.header", "Header"),
                        value: "header"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.sidebar", "Sidebar"),
                        value: "sidebar"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.tooltip", "Tooltip"),
                        value: "tooltip"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.menu", "Menu"),
                        value: "menu"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.popover", "Popover"),
                        value: "popover"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.fullscreen", "Fullscreen UI (transparent but slightly muted)"),
                        value: "fullscreen-ui"
                    },
                    {
                        label: t("ui.vencord.macVibrancy.hud", "HUD (Most transparent)"),
                        value: "hud"
                    },
                ]}
                select={v => settings.macosVibrancyStyle = v}
                isSelected={v => settings.macosVibrancyStyle === v}
                serialize={identity}
            />
        </ErrorBoundary>
    );
}
