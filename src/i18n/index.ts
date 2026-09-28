/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vencord zh-CN contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Vencord lightweight localization entry point.
 *
 * Usage for Vencord-owned UI strings:
 *
 *     t("ui.plugins.searchPlaceholder", "Search for a plugin...")
 *
 * The English text passed as `fallback` is the single source of truth for
 * en-US; locale tables only contain translations. A missing key, an unknown
 * locale or a broken table therefore degrades to the English original.
 *
 * Strings that Discord already provides (i18n.Messages / getIntlMessage)
 * are NOT part of this system: they must keep using Discord's own zh-CN.
 *
 * Note: the active locale is read from Discord's LocaleStore on every call.
 * Components do not re-render by themselves when the locale changes, but a
 * settings page re-open (or app restart) picks up the new language.
 */

import { LocaleStore, useStateFromStores } from "@webpack/common";

import { pluginMatchesTranslatedQuery, type SettingDefStrings, translate, translatePluginMeta, translateSettingDef, type TranslationTable } from "./core";
import zhCN from "./locales/zh-CN";

const tables: Record<string, TranslationTable> = {
    "zh-CN": zhCN,
};

export function getCurrentLocale(): string {
    try {
        const locale = (LocaleStore as { locale?: string; } | undefined)?.locale;
        return typeof locale === "string" ? locale : "en-US";
    } catch {
        return "en-US";
    }
}

export function getTranslationTable(): TranslationTable | undefined {
    try {
        return tables[getCurrentLocale()];
    } catch {
        return undefined;
    }
}

/**
 * React hook: subscribes the calling component to Discord's LocaleStore so it
 * re-renders when the user changes Discord's language. Call it once in every
 * component that renders `t(...)` strings; the plain `t` function then picks
 * up the new locale during that re-render.
 *
 * Reuses Discord's own useStateFromStores hook (the same pattern Vencord uses
 * for other stores) instead of inventing a custom reactivity system.
 */
export function useVencordLocale(): string {
    return useStateFromStores([LocaleStore], () => getCurrentLocale());
}

/**
 * Translate a Vencord-owned UI string for the current locale.
 * Returns `fallback` (the English source text) unless a translation exists.
 */
export function t(key: string, fallback: string, vars?: Record<string, unknown>): string {
    return translate(getTranslationTable(), key, fallback, vars);
}

export interface LocalizedPluginStrings {
    name: string;
    description: string;
}

interface MinimalPlugin {
    name: string;
    description: string;
    searchTerms?: string[];
}

/** Localized display name of a plugin (English when untranslated). */
export function tPluginName(plugin: MinimalPlugin): string {
    return translatePluginMeta(getTranslationTable(), plugin.name, plugin).name;
}

/** Localized display description of a plugin (English when untranslated). */
export function tPluginDescription(plugin: MinimalPlugin): string {
    return translatePluginMeta(getTranslationTable(), plugin.name, plugin).description;
}

/** Localized display tag (English when untranslated). */
export function tTag(tag: string): string {
    return translate(getTranslationTable(), `tag.${tag}`, tag);
}

/**
 * Display copy of a plugin settings definition for the current locale.
 * Returns a shallow copy; the original definition is never mutated.
 * The copy is display-only: option arrays come back as plain mutable arrays
 * and must not be written back into the settings store.
 */
export function tSettingDef<S>(pluginName: string, settingKey: string, setting: S): S {
    return translateSettingDef(
        getTranslationTable(),
        pluginName,
        settingKey,
        setting as unknown as SettingDefStrings
    ) as unknown as S;
}

/**
 * Whether the lowercased `search` matches the translated name/description.
 * Callers combine this with the original English matching, so plugins stay
 * searchable in both languages.
 */
export function pluginMatchesQuery(plugin: MinimalPlugin, search: string): boolean {
    return pluginMatchesTranslatedQuery(getTranslationTable(), plugin.name, plugin, search);
}
