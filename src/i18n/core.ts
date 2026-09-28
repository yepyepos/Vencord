/*
 * Vencord, a Discord client mod
 * Copyright (c) 2026 Vencord zh-CN contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * Vencord lightweight localization core.
 *
 * This module is pure logic and must not import anything: it is exercised
 * directly by scripts/test-i18n.ts in Node. All lookups are defensive:
 * a missing key, a broken table or a malformed entry always degrades to the
 * English fallback instead of throwing. Translation data itself lives in
 * ./locales/<locale>.ts as plain data.
 */

export type TranslationTable = Record<string, string>;

export interface PluginMetaStrings {
    name: string;
    description: string;
}

export interface SettingOptionDef {
    label: string;
    value: unknown;
    [key: string]: unknown;
}

export interface SettingDefStrings {
    description?: string;
    displayName?: string;
    placeholder?: string;
    options?: SettingOptionDef[];
}

/**
 * Replace `{name}` placeholders in a translation template. Unknown
 * placeholders are left untouched so a typo degrades to readable English.
 */
export function formatTemplate(template: string, vars?: Record<string, unknown>): string {
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) => {
        const value = vars[name];
        return value === undefined ? match : String(value);
    });
}

/**
 * Look up `key` in `table` and return the formatted translation.
 * Falls back to `fallback` (formatted with the same vars) when the table is
 * missing, the key is absent, or the entry is not a non-empty string.
 */
export function translate(table: TranslationTable | undefined | null, key: string, fallback: string, vars?: Record<string, unknown>): string {
    let translated: string | undefined;
    try {
        const entry = table?.[key];
        if (typeof entry === "string" && entry.length > 0)
            translated = entry;
    } catch {
        // broken table: treat as untranslated
    }
    return formatTemplate(translated ?? fallback, vars);
}

/**
 * Display strings for a plugin's metadata. Never mutates the original.
 */
export function translatePluginMeta(table: TranslationTable | undefined | null, pluginName: string, original: PluginMetaStrings): PluginMetaStrings {
    if (!table) return original;
    return {
        name: translate(table, `plugin.${pluginName}.name`, original.name),
        description: translate(table, `plugin.${pluginName}.description`, original.description),
    };
}

/**
 * Display copy of a single settings definition. Returns a shallow copy and
 * never mutates the original: the untouched def remains the settings store
 * schema. Option labels are looked up by `option.<value>` so the (stable)
 * option value is the key, not the English label.
 */
export function translateSettingDef(table: TranslationTable | undefined | null, pluginName: string, settingKey: string, original: SettingDefStrings): SettingDefStrings {
    try {
        if (!table) return original;

        const prefix = `plugin.${pluginName}.settings.${settingKey}`;
        const translated: SettingDefStrings = { ...original };

        translated.description = translate(table, `${prefix}.description`, original.description ?? "");
        if (typeof original.displayName === "string")
            translated.displayName = translate(table, `${prefix}.displayName`, original.displayName);
        else if (typeof table[`${prefix}.displayName`] === "string")
            translated.displayName = table[`${prefix}.displayName`];
        if (typeof original.placeholder === "string")
            translated.placeholder = translate(table, `${prefix}.placeholder`, original.placeholder);

        if (original.options?.length) {
            translated.options = (original.options as SettingOptionDef[]).map(option => ({
                ...option,
                label: translate(table, `${prefix}.option.${String(option.value)}`, option.label),
            }));
        }

        return translated;
    } catch {
        return original;
    }
}

/**
 * Whether `search` (already lowercased by the caller) matches the translated
 * name or description of a plugin. Combined with the original English match
 * in the caller, this makes plugins findable in both languages.
 */
export function pluginMatchesTranslatedQuery(table: TranslationTable | undefined | null, pluginName: string, original: PluginMetaStrings, search: string): boolean {
    if (!search) return false;
    try {
        const translated = translatePluginMeta(table, pluginName, original);
        return (
            translated.name.toLowerCase().includes(search) ||
            translated.description.toLowerCase().includes(search)
        );
    } catch {
        return false;
    }
}
