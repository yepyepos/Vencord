/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import "./styles.css";

import * as DataStore from "@api/DataStore";
import { isPluginEnabled } from "@api/PluginManager";
import { useSettings } from "@api/Settings";
import { Card } from "@components/Card";
import { Divider } from "@components/Divider";
import ErrorBoundary from "@components/ErrorBoundary";
import { HeadingTertiary } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { SettingsTab, wrapTab } from "@components/settings/tabs/BaseTab";
import { pluginMatchesTranslatedQueryLocal,t, tTag } from "@i18n";
import { ChangeList } from "@utils/ChangeList";
import { classNameFactory } from "@utils/css";
import { isTruthy } from "@utils/guards";
import { Logger } from "@utils/Logger";
import { Margins } from "@utils/margins";
import { classes } from "@utils/misc";
import { PluginTarget } from "@utils/pluginTargets";
import { useAwaiter, useCleanupEffect } from "@utils/react";
import { PluginTag, PluginTags } from "@utils/types";
import { Button, ConfirmModal, lodash, openModal, Parser, React, SearchableSelect, Select, TextInput, Tooltip, useMemo, useRef, useState } from "@webpack/common";
import { JSX } from "react";

import Plugins, { ExcludedPlugins, PluginMeta } from "~plugins";

import { PluginCard } from "./PluginCard";
import { UIElementsButton } from "./UIElements";

export const cl = classNameFactory("vc-plugins-");
export const logger = new Logger("PluginSettings", "#a6d189");

function ReloadRequiredCard({ required }: { required: boolean; }) {
    return (
        <Card variant={required ? "warning" : "normal"} className={cl("info-card")}>
            {required
                ? (
                    <>
                        <HeadingTertiary>{t("ui.plugins.restartRequiredHeading", "Restart required!")}</HeadingTertiary>
                        <Paragraph className={cl("dep-text")}>
                            {t("ui.plugins.restartNowToApply", "Restart now to apply new plugins and their settings")}
                        </Paragraph>
                        <Button onClick={() => location.reload()} className={cl("restart-button")}>
                            {t("ui.plugins.restart", "Restart")}
                        </Button>
                    </>
                )
                : (
                    <>
                        <HeadingTertiary>{t("ui.plugins.pluginManagement", "Plugin Management")}</HeadingTertiary>
                        <Paragraph>{t("ui.plugins.pressCogWheel", "Press the cog wheel or info icon to get more info on a plugin")}</Paragraph>
                        <Paragraph>{t("ui.plugins.cogWheelHasSettings", "Plugins with a cog wheel have settings you can modify!")}</Paragraph>
                    </>
                )}
        </Card>
    );
}

const enum SearchStatus {
    ALL,
    FAVORITES,
    ENABLED,
    DISABLED,
    NEW,
    USER_PLUGINS,
    API_PLUGINS
}

function ExcludedPluginsList({ search }: { search: string; }) {
    const matchingExcludedPlugins = search
        ? Object.entries(ExcludedPlugins)
            .filter(([name]) => name.toLowerCase().includes(search))
        : [];

    const ExcludedReasons: Record<PluginTarget, string> = {
        desktop: t("ui.plugins.target.desktop", "Discord Desktop app or Vesktop"),
        discordDesktop: t("ui.plugins.target.discordDesktop", "Discord Desktop app"),
        vesktop: t("ui.plugins.target.vesktop", "Vesktop app"),
        web: t("ui.plugins.target.web", "Vesktop app and the Web version of Discord"),
        dev: t("ui.plugins.target.dev", "Developer version of Vencord"),
        browser: t("ui.plugins.target.browser", "Web Browser version of Vencord")
    };

    return (
        <Paragraph className={Margins.top16}>
            {matchingExcludedPlugins.length
                ? <>
                    <Paragraph>{t("ui.plugins.areYouLookingFor", "Are you looking for:")}</Paragraph>
                    <ul>
                        {matchingExcludedPlugins.map(([name, reason]) => (
                            <li key={name}>
                                <b>{name}</b>: {t("ui.plugins.onlyAvailableOn", "Only available on the {platform}", { platform: ExcludedReasons[reason] })}
                            </li>
                        ))}
                    </ul>
                </>
                : t("ui.plugins.noResults", "No plugins meet the search criteria.")
            }
        </Paragraph>
    );
}

function PluginSettings() {
    const settings = useSettings();
    const changeRef = useRef<ChangeList<string>>(null);
    const changes = changeRef.current ??= new ChangeList<string>();

    useCleanupEffect(() => {
        if (changes.hasChanges)
            openModal(props => (
                <ConfirmModal
                    {...props}
                    title={t("ui.plugins.restartRequired", "Restart required")}
                    confirmText={t("ui.plugins.restartNow", "Restart now")}
                    cancelText={t("ui.plugins.restartLater", "Later!")}
                    variant="primary"
                    onConfirm={() => location.reload()}
                >
                    <>
                        <p>{t("ui.plugins.restartRequiredList", "The following plugins require a restart:")}</p>
                        <div>{changes.map((s, i) => (
                            <React.Fragment key={s}>
                                {i > 0 && ", "}
                                {Parser.parse("`" + s.split(".")[0] + "`")}
                            </React.Fragment>
                        ))}</div>
                    </>
                </ConfirmModal>
            ));
    }, []);

    const depMap = useMemo(() => {
        const o = {} as Record<string, string[]>;
        for (const plugin in Plugins) {
            const deps = Plugins[plugin].dependencies;
            if (deps) {
                for (const dep of deps) {
                    o[dep] ??= [];
                    o[dep].push(plugin);
                }
            }
        }
        return o;
    }, []);

    const sortedPlugins = useMemo(() =>
        Object.values(Plugins).sort((a, b) => a.name.localeCompare(b.name)),
        []
    )
        .toSorted((a, b) => Number(settings.plugins[b.name]?.isFavorite ?? false) - Number(settings.plugins[a.name]?.isFavorite ?? false));

    const hasUserPlugins = useMemo(() => !IS_STANDALONE && Object.values(PluginMeta).some(m => m.userPlugin), []);

    const [searchValue, setSearchValue] = useState({ value: "", tags: [] as PluginTag[], status: SearchStatus.ALL });

    const search = searchValue.value.toLowerCase();
    const onSearch = (query: string) => setSearchValue(prev => ({ ...prev, value: query }));

    const pluginFilter = (plugin: typeof Plugins[keyof typeof Plugins]) => {
        const { status, tags } = searchValue;

        switch (status) {
            case SearchStatus.FAVORITES:
                if (!settings.plugins[plugin.name]?.isFavorite) return false;
                break;
            case SearchStatus.DISABLED:
                if (isPluginEnabled(plugin.name)) return false;
                break;
            case SearchStatus.ENABLED:
                if (!isPluginEnabled(plugin.name)) return false;
                break;
            case SearchStatus.NEW:
                if (!newPlugins?.includes(plugin.name)) return false;
                break;
            case SearchStatus.USER_PLUGINS:
                if (!PluginMeta[plugin.name]?.userPlugin) return false;
                break;
            case SearchStatus.API_PLUGINS:
                if (!plugin.name.endsWith("API")) return false;
                break;
        }

        if (tags.length && tags.some(t => !plugin.tags?.includes(t))) return false;

        if (!search.length) return true;

        return (
            plugin.name.toLowerCase().includes(search) ||
            plugin.name.match(/[A-Z]/g)?.join("").toLowerCase().includes(search) || // acronyms like BF for BetterFolders
            plugin.description.toLowerCase().includes(search) ||
            plugin.searchTerms?.some(t => t.toLowerCase().includes(search)) ||
            pluginMatchesTranslatedQueryLocal(plugin, search) // translated name/description (e.g. Chinese)
        );
    };

    const [newPlugins] = useAwaiter(() => DataStore.get("Vencord_existingPlugins").then((cachedPlugins: Record<string, number> | undefined) => {
        const now = Date.now() / 1000;
        const existingTimestamps: Record<string, number> = {};
        const sortedPluginNames = Object.values(sortedPlugins).map(plugin => plugin.name);

        const newPlugins: string[] = [];
        for (const { name: p } of sortedPlugins) {
            const time = existingTimestamps[p] = cachedPlugins?.[p] ?? now;
            if ((time + 60 * 60 * 24 * 2) > now) {
                newPlugins.push(p);
            }
        }
        DataStore.set("Vencord_existingPlugins", existingTimestamps);

        return lodash.isEqual(newPlugins, sortedPluginNames) ? [] : newPlugins;
    }));

    const plugins = [] as JSX.Element[];
    const requiredPlugins = [] as JSX.Element[];

    const showApi = searchValue.status === SearchStatus.API_PLUGINS;
    for (const p of sortedPlugins) {
        if (p.hidden || (!p.settings && p.name.endsWith("API") && !showApi))
            continue;

        if (!pluginFilter(p)) continue;

        const isRequired = p.required || p.isDependency || depMap[p.name]?.some(d => settings.plugins[d].enabled);

        if (isRequired) {
            const tooltipText = p.required || !depMap[p.name]
                ? t("ui.plugins.requiredTooltip", "This plugin is required for Vencord to function.")
                : makeDependencyList(depMap[p.name]?.filter(d => settings.plugins[d].enabled));

            requiredPlugins.push(
                <Tooltip text={tooltipText} key={p.name}>
                    {({ onMouseLeave, onMouseEnter }) => (
                        <PluginCard
                            onMouseLeave={onMouseLeave}
                            onMouseEnter={onMouseEnter}
                            onRestartNeeded={(name, key) => changes.handleChange(`${name}.${key}`)}
                            disabled={true}
                            plugin={p}
                            key={p.name}
                        />
                    )}
                </Tooltip>
            );
        } else {
            plugins.push(
                <PluginCard
                    onRestartNeeded={(name, key) => changes.handleChange(`${name}.${key}`)}
                    disabled={false}
                    plugin={p}
                    isNew={newPlugins?.includes(p.name)}
                    key={p.name}
                />
            );
        }
    }

    return (
        <SettingsTab>
            <ReloadRequiredCard required={changes.hasChanges} />

            <UIElementsButton />

            <HeadingTertiary className={classes(Margins.top20, Margins.bottom8)}>
                {t("ui.plugins.filtersHeading", "Filters")}
            </HeadingTertiary>

            <ErrorBoundary noop>
                <TextInput
                    inputClassName={cl("filter-control")}
                    placeholder={t("ui.plugins.searchPlaceholder", "Search for a plugin...")}
                    value={searchValue.value}
                    onChange={onSearch}
                    autoFocus
                />
            </ErrorBoundary>

            <ErrorBoundary noop>
                <div className={classes(Margins.bottom20, Margins.top8, cl("filter-controls"))}>
                    <Select
                        options={[
                            { label: t("ui.plugins.showAll", "Show All"), value: SearchStatus.ALL, default: true },
                            { label: t("ui.plugins.showFavorites", "Show Favorites"), value: SearchStatus.FAVORITES },
                            { label: t("ui.plugins.showEnabled", "Show Enabled"), value: SearchStatus.ENABLED },
                            { label: t("ui.plugins.showDisabled", "Show Disabled"), value: SearchStatus.DISABLED },
                            { label: t("ui.plugins.showNew", "Show New"), value: SearchStatus.NEW },
                            hasUserPlugins && { label: t("ui.plugins.showUserPlugins", "Show UserPlugins"), value: SearchStatus.USER_PLUGINS },
                            { label: t("ui.plugins.showApiPlugins", "Show API Plugins"), value: SearchStatus.API_PLUGINS },
                        ].filter(isTruthy)}
                        serialize={String}
                        select={status => setSearchValue(prev => ({ ...prev, status }))}
                        isSelected={v => v === searchValue.status}
                        closeOnSelect={true}
                        placeholder={t("ui.plugins.filterByType", "Filter by Type")}
                    />
                    <SearchableSelect
                        options={PluginTags.map(tag => ({ label: tTag(tag), value: tag }))}
                        value={searchValue.tags}
                        onChange={tags => setSearchValue(prev => ({ ...prev, tags }))}
                        closeOnSelect={false}
                        placeholder={t("ui.plugins.filterByTags", "Filter by Tags")}
                        multi
                    />
                </div>
            </ErrorBoundary>

            <HeadingTertiary className={Margins.top20}>{t("ui.plugins.pluginsHeading", "Plugins")}</HeadingTertiary>

            {plugins.length || requiredPlugins.length
                ? (
                    <div className={cl("grid")}>
                        {plugins.length
                            ? plugins
                            : <Paragraph>{t("ui.plugins.noResults", "No plugins meet the search criteria.")}</Paragraph>
                        }
                    </div>
                )
                : <ExcludedPluginsList search={search} />
            }


            <Divider className={Margins.top20} />

            <HeadingTertiary className={classes(Margins.top20, Margins.bottom8)}>
                {t("ui.plugins.requiredHeading", "Required Plugins")}
            </HeadingTertiary>

            <div className={cl("grid")}>
                {requiredPlugins.length
                    ? requiredPlugins
                    : <Paragraph>No plugins meet the search criteria.</Paragraph>
                }
            </div>
        </SettingsTab >
    );
}

function makeDependencyList(deps: string[]) {
    return (
        <>
            <Paragraph>{t("ui.plugins.requiredBy", "This plugin is required by:")}</Paragraph>
            {deps.map((dep: string) => <Paragraph key={dep} className={cl("dep-text")}>{dep}</Paragraph>)}
        </>
    );
}

export default wrapTab(PluginSettings, "Plugins");
