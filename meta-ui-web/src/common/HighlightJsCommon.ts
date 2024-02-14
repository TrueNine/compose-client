import internalHljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import typescript from "highlight.js/lib/languages/typescript";

const languages = {
    javascript,
    json,
    kotlin,
    typescript,
};

Object.entries(languages).forEach(([key, value]) => {
    internalHljs.registerLanguage(key, value);
});

export const hljs = internalHljs;
