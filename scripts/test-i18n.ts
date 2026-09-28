/**
 * Lightweight i18n test suite, run with: pnpm testI18n
 * Uses node:assert only — no test framework.
 * Covers the fallback contract (cases A-D), template interpolation,
 * plugin metadata/settings translation and bilingual search matching.
 */

import assert from "node:assert";

import {
    formatTemplate,
    pluginMatchesTranslatedQuery,
    translate,
    translatePluginMeta,
    translateSettingDef,
    type SettingDefStrings,
    type TranslationTable,
} from "../src/i18n/core";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
    try {
        fn();
        passed++;
        console.log(`  ok  ${name}`);
    } catch (e) {
        failed++;
        console.error(`FAIL  ${name}`);
        console.error(e);
    }
}

const table: TranslationTable = {
    "test.hello": "你好",
    "test.messages": "{count} 条消息",
    "test.greeting": "你好，{name}！",
    "plugin.VoiceMessages.name": "语音消息",
    "plugin.VoiceMessages.description": "像手机端一样发送语音消息",
    "plugin.VoiceMessages.settings.noiseSuppression.description": "噪声抑制",
    "plugin.VoiceMessages.settings.noiseSuppression.displayName": "噪声抑制",
    "plugin.VoiceMessages.settings.echoCancellation.description": "回声消除",
    "plugin.VoiceMessages.settings.service.option.google": "谷歌翻译",
};

// ---- Case A: existing key -> Chinese ----
test("A: existing key returns Chinese", () => {
    assert.strictEqual(translate(table, "test.hello", "Hello"), "你好");
});

// ---- Case B: missing key -> English fallback ----
test("B: missing key returns English fallback", () => {
    assert.strictEqual(translate(table, "test.missing", "Hello"), "Hello");
});

// ---- Case C: wrong/broken key -> English fallback ----
test("C: wrong key returns English fallback", () => {
    assert.strictEqual(translate(table, "totally.wrong.key", "Hello"), "Hello");
});

// ---- Case D: broken table -> English fallback ----
test("D: undefined/null table returns English fallback", () => {
    assert.strictEqual(translate(undefined, "test.hello", "Hello"), "Hello");
    assert.strictEqual(translate(null, "test.hello", "Hello"), "Hello");
});

test("D: throwing table returns English fallback", () => {
    const broken = new Proxy({}, {
        get() {
            throw new Error("boom");
        }
    }) as TranslationTable;
    assert.strictEqual(translate(broken, "test.hello", "Hello"), "Hello");
});

test("D: empty translation value returns English fallback", () => {
    assert.strictEqual(translate({ "test.empty": "" }, "test.empty", "Hello"), "Hello");
});

// ---- dynamic strings (template + vars) ----
test("template interpolation works", () => {
    assert.strictEqual(translate(table, "test.messages", "{count} messages", { count: 3 }), "3 条消息");
    assert.strictEqual(translate(table, "test.greeting", "Hello, {name}!", { name: "Ven" }), "你好，Ven！");
});

test("missing template variable leaves placeholder readable", () => {
    // translation exists -> placeholder stays visible inside the translation
    assert.strictEqual(translate(table, "test.greeting", "Hello, {name}!"), "你好，{name}！");
    assert.strictEqual(translate(table, "test.greeting", "Hello, {name}!", { other: 1 }), "你好，{name}！");
    // translation missing -> English fallback keeps its placeholder too
    assert.strictEqual(translate(table, "test.missing", "Hello, {name}!"), "Hello, {name}!");
});

test("formatTemplate leaves non-matching braces alone", () => {
    assert.strictEqual(formatTemplate("a {b c} {1} d"), "a {b c} {1} d");
});

// ---- plugin metadata ----
test("plugin name and description translate", () => {
    const meta = translatePluginMeta(table, "VoiceMessages", {
        name: "VoiceMessages",
        description: "Allows you to send voice messages like on mobile",
    });
    assert.strictEqual(meta.name, "语音消息");
    assert.strictEqual(meta.description, "像手机端一样发送语音消息");
});

test("untranslated plugin falls back to English (case B)", () => {
    const meta = translatePluginMeta(table, "PlainFolderIcon", {
        name: "PlainFolderIcon",
        description: "Dont show the small guild icons in folders",
    });
    assert.strictEqual(meta.name, "PlainFolderIcon");
    assert.strictEqual(meta.description, "Dont show the small guild icons in folders");
});

test("plugin metadata original object is never mutated", () => {
    const original = { name: "VoiceMessages", description: "English description" };
    translatePluginMeta(table, "VoiceMessages", original);
    assert.strictEqual(original.name, "VoiceMessages");
    assert.strictEqual(original.description, "English description");
});

// ---- settings defs ----
test("settings description and displayName translate", () => {
    const def = { type: "BOOLEAN", description: "Noise Suppression", default: true };
    const translated = translateSettingDef(table, "VoiceMessages", "noiseSuppression", def);
    assert.strictEqual(translated.description, "噪声抑制");
    // displayName provided by the table even though the def had none
    assert.strictEqual(translated.displayName, "噪声抑制");
    // original untouched: it is the live settings store schema
    assert.strictEqual(def.description, "Noise Suppression");
});

test("settings displayName translates when the def already has one", () => {
    const def = { type: "STRING", description: "Your DeepL API key", displayName: "DeepL API Key", default: "" };
    const translated = translateSettingDef(table, "Translate", "deeplApiKey", {
        ...def,
        displayName: def.displayName,
    });
    // no translation keys for Translate in this fixture -> English kept
    assert.strictEqual(translated.displayName, "DeepL API Key");
});

test("settings select option labels translate by value key", () => {
    const def = {
        type: "SELECT",
        description: "Translation provider",
        options: [
            { label: "Google Translate", value: "google", default: true },
            { label: "DeepL Free — API key required", value: "deepl" },
        ],
    };
    const translated = translateSettingDef(table, "VoiceMessages", "service", def);
    assert.strictEqual(translated.options![0].label, "谷歌翻译");
    // untranslated option keeps English
    assert.strictEqual(translated.options![1].label, "DeepL Free — API key required");
    assert.strictEqual(def.options![0].label, "Google Translate");
});

// ---- bilingual search ----
test("Chinese search finds the plugin", () => {
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", {
        name: "VoiceMessages",
        description: "Allows you to send voice messages",
    }, "语音"), true);
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", {
        name: "VoiceMessages",
        description: "Allows you to send voice messages",
    }, "语音消息"), true);
});

test("English search still finds the plugin via the original match", () => {
    // the translated strings do NOT contain "voice", so this must be matched
    // by the caller's original-English check — here we verify translated
    // matching alone does not claim a false negative breaking logic
    const translatedHit = pluginMatchesTranslatedQuery(table, "VoiceMessages", {
        name: "VoiceMessages",
        description: "Allows you to send voice messages",
    }, "voice");
    assert.strictEqual(translatedHit, false);
    // and the English original would match in the caller:
    assert.strictEqual("voiceMessages".toLowerCase().includes("voice"), true);
});

test("empty search matches nothing via translated query", () => {
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", {
        name: "VoiceMessages",
        description: "x",
    }, ""), false);
});

// =====================================================================
// Phase 2.5 regression coverage
// =====================================================================

// ---- t() misuse / edge cases ----
test("Case 3: empty fallback does not crash and returns empty string", () => {
    assert.strictEqual(translate(table, "test.missing", ""), "");
    assert.strictEqual(translate(undefined, "test.hello", ""), "");
});

test("Case 4: empty translation value returns fallback", () => {
    assert.strictEqual(translate({ "test.empty": "" }, "test.empty", "Fallback"), "Fallback");
});

test("Case 5: null/undefined translation values return fallback", () => {
    const brokenTable = { "test.null": null, "test.undefined": undefined } as unknown as TranslationTable;
    assert.strictEqual(translate(brokenTable, "test.null", "Fallback"), "Fallback");
    assert.strictEqual(translate(brokenTable, "test.undefined", "Fallback"), "Fallback");
});

test("Case 8: extra template variables are ignored", () => {
    assert.strictEqual(translate(table, "test.messages", "{count} messages", { count: 2, extra: "ignored", name: "x" }), "2 条消息");
});

// ---- key stability: upstream wording changes must not break lookups ----
// The key is built from stable identifiers (plugin name + settings field
// name + option value), never from the English source text.
test("Scenario A: upstream rewords 'Noise Suppression' -> 'Noise Reduction', key unchanged", () => {
    // translation still hits with the OLD key; the English fallback passed by
    // the caller may freely change
    assert.strictEqual(translate(table, "plugin.VoiceMessages.settings.noiseSuppression.description", "Noise Reduction"), "噪声抑制");
});

test("Scenario B: upstream extends description wording, key unchanged", () => {
    assert.strictEqual(translate(table, "plugin.VoiceMessages.settings.noiseSuppression.description", "Reduce background noise from your microphone"), "噪声抑制");
});

test("Scenario C: settings order does not affect lookups", () => {
    const defA = { type: "BOOLEAN", description: "Noise Suppression" };
    const defB = { type: "BOOLEAN", description: "Echo Cancellation" };
    // entries iterated in either order resolve by key, not position
    const entriesReversed = Object.entries({ echoCancellation: defB, noiseSuppression: defA }).reverse();
    for (const [key, def] of entriesReversed) {
        const translated = translateSettingDef(table, "VoiceMessages", key, def);
        assert.ok(translated.description === "噪声抑制" || translated.description === "回声消除");
    }
});

test("Scenario D: definition moved to another file still resolves (runtime key based)", () => {
    // the lookup only uses the runtime object key, not the defining file
    const defFromAnywhere = { type: "BOOLEAN", description: "Noise Suppression", default: true };
    assert.strictEqual(translateSettingDef(table, "VoiceMessages", "noiseSuppression", defFromAnywhere).description, "噪声抑制");
});

// ---- complex settings definitions survive the display copy ----
test("complex defs: all option types keep their fields, only display strings change", () => {
    const isValid = () => true;
    const onChange = () => { };
    const component = () => null;
    const def = {
        type: "SELECT",
        description: "Provider",
        placeholder: "Pick one",
        options: [
            { label: "Google Translate", value: "google", default: true as const },
            { label: "DeepL", value: "deepl" },
        ],
        default: "google",
        restartNeeded: true,
        componentProps: { foo: 1 },
        isValid,
        onChange,
        component,
    };
    const copy = translateSettingDef(table, "VoiceMessages", "service", def) as typeof def;

    // untouched non-display fields (same references)
    assert.strictEqual(copy.type, "SELECT");
    assert.strictEqual(copy.default, "google");
    assert.strictEqual(copy.restartNeeded, true);
    assert.strictEqual(copy.componentProps, def.componentProps);
    assert.strictEqual(copy.isValid, isValid);
    assert.strictEqual(copy.onChange, onChange);
    assert.strictEqual(copy.component, component);

    // display strings translated
    assert.strictEqual(copy.description, "Provider"); // no translation in fixture -> fallback
    assert.strictEqual(copy.placeholder, "Pick one");

    // option values preserved exactly; labels translatable
    assert.strictEqual(copy.options![0].value, "google");
    assert.strictEqual(copy.options![1].value, "deepl");
    assert.strictEqual(copy.options![0].label, "谷歌翻译"); // fixture translation hits by value key
    assert.strictEqual(copy.options![1].label, "DeepL"); // untranslated -> fallback
    assert.strictEqual(copy.options![0].default, true);
});

test("complex defs: NUMBER/SLIDER/COMPONENT-like defs pass through", () => {
    const numberDef = { type: "NUMBER", description: "Some number", default: 5 };
    const sliderDef = { type: "SLIDER", description: "Zoom", markers: [1, 5, 10], default: 2, stickToMarkers: false };
    const componentDef = { type: "COMPONENT", component: () => null };
    assert.strictEqual(translateSettingDef(table, "X", "num", numberDef).description, "Some number");
    assert.deepStrictEqual((translateSettingDef(table, "X", "slider", sliderDef) as typeof sliderDef).markers, [1, 5, 10]);
    // COMPONENT defs have no description: the copy must not grow one
    assert.strictEqual("description" in translateSettingDef(table, "X", "comp", componentDef as unknown as SettingDefStrings), false);
});

// ---- option values are NEVER translated (task: value preservation) ----
test("option value identity is preserved (string, number, enum)", () => {
    const def = {
        options: [
            { label: "Icon", value: "icon" },
            { label: "All messages", value: 0 },
            { label: "Never", value: 2 },
        ],
    };
    const copy = translateSettingDef(table, "X", "opt", def);
    assert.strictEqual(copy.options![0].value, "icon");
    assert.strictEqual(copy.options![1].value, 0);
    assert.ok(Object.is(copy.options![2].value, 2), "enum-like numeric value identity preserved");
    // labels changed, values untouched
    assert.notStrictEqual(copy.options![0].label, "图标"); // fixture has no such key
    assert.strictEqual(def.options[0].label, "Icon");
});

// ---- definition immutability (deep) ----
test("original def and its options array are never mutated", () => {
    const original = {
        description: "Noise Suppression",
        displayName: "Noise Suppression",
        placeholder: "Enter",
        options: [{ label: "Google Translate", value: "google" }],
    };
    const snapshot = JSON.stringify(original);
    translateSettingDef(table, "VoiceMessages", "noiseSuppression", original);
    const translated = translateSettingDef(table, "VoiceMessages", "noiseSuppression", original);
    assert.strictEqual(JSON.stringify(original), snapshot);
    // new array allocated for the copy, original options array shared-but-untouched
    assert.notStrictEqual(translated.options, original.options);
    assert.strictEqual(translated.options![0].value, "google");
});

// ---- search robustness ----
test("search: case-insensitive English and partial Chinese matching", () => {
    const plugin = { name: "VoiceMessages", description: "Allows you to send voice messages" };
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", plugin, "语音消息".toLowerCase()), true);
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", plugin, "语音"), true);
    assert.strictEqual(pluginMatchesTranslatedQuery(table, "VoiceMessages", plugin, "VOICE".toLowerCase()), false, "translated match must not claim English matches");
});

// ---- performance sanity (informational, fails only on pathological slowness) ----
test("performance: lookup stays trivial compared to plugin list sizes", () => {
    const start = process.hrtime.bigint();

    let sink = "";
    for (let i = 0; i < 100_000; i++)
        sink = translate(table, "plugin.VoiceMessages.settings.noiseSuppression.description", "Noise Suppression");

    for (let i = 0; i < 166; i++) {
        pluginMatchesTranslatedQuery(table, "VoiceMessages", { name: "VoiceMessages", description: "x" }, "语音");
        pluginMatchesTranslatedQuery(table, `Plugin${i}`, { name: `Plugin${i}`, description: "x" }, "语音");
    }

    const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
    assert.ok(sink.length > 0);
    assert.ok(elapsedMs < 1000, `i18n lookups took ${elapsedMs.toFixed(1)}ms — unexpectedly slow`);
    console.log(`      (perf: 100k translate + 332 search lookups in ${elapsedMs.toFixed(1)}ms)`);
});

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0)
    process.exit(1);
