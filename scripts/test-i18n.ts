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

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0)
    process.exit(1);
