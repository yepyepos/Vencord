/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { useSettings } from "@api/Settings";
import ErrorBoundary from "@components/ErrorBoundary";
import { Heading } from "@components/Heading";
import { Margins } from "@components/margins";
import { Paragraph } from "@components/Paragraph";
import { t } from "@i18n";
import { IS_WINDOWS } from "@utils/constants";
import { Select } from "@webpack/common";

export function WindowsMaterialSettings() {
    const settings = useSettings(["windowsMaterial"]);

    if (!IS_WINDOWS || IS_WEB || !VencordNative.native.supportsWindowsMaterial()) return null;

    return (
        <ErrorBoundary noop>
            <Heading tag="h5">{t("ui.vencord.backgroundMaterial.heading", "Background Material")}</Heading>
            <Paragraph className={Margins.bottom8}>
                {t("ui.vencord.backgroundMaterial.description", "Windows transparent background effects. You need a theme that supports transparency or this will do nothing. A restart is required after changing this setting.")}
            </Paragraph>

            <Select
                placeholder={t("ui.vencord.backgroundMaterial.none", "None")}
                options={[
                    {
                        label: t("ui.vencord.backgroundMaterial.none", "None"),
                        value: "none",
                        default: true
                    },
                    {
                        label: t("ui.vencord.backgroundMaterial.mica", "Mica (incorporates system theme + desktop wallpaper to paint the background)"),
                        value: "mica"
                    },
                    {
                        label: t("ui.vencord.backgroundMaterial.tabbed", "Tabbed (variant of Mica with stronger background tinting)"),
                        value: "tabbed"
                    },
                    {
                        label: t("ui.vencord.backgroundMaterial.acrylic", "Acrylic (blurs the window behind Vesktop for a translucent background)"),
                        value: "acrylic"
                    }
                ]}
                closeOnSelect={true}
                select={v => (settings.windowsMaterial = v)}
                isSelected={v => v === settings.windowsMaterial}
                serialize={s => s}
            />
        </ErrorBoundary>
    );
}
