"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
function isObject(it) {
    // This is necessary because:
    // typeof null === 'object'
    // typeof [] === 'object'
    // [] instanceof Object === true
    return Object.prototype.toString.call(it) === "[object Object]";
}
exports.isObject = isObject;
/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
function isArray(it) {
    // wotan-disable-next-line no-useless-predicate
    if (Array.isArray != null)
        return Array.isArray(it);
    return Object.prototype.toString.call(it) === "[object Array]";
}
exports.isArray = isArray;
/**
 * Translates text using the Google Translate API
 * @param text The text to translate
 * @param targetLang The target languate
 */
async function translateText(text, targetLang) {
    if (targetLang === "en")
        return text;
    try {
        const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}&ie=UTF-8&oe=UTF-8`;
        const response = await axios_1.default({ url, timeout: 5000 });
        if (isArray(response.data)) {
            // we got a valid response
            return response.data[0][0][0];
        }
        throw new Error("Invalid response for translate request");
    }
    catch (e) {
        throw new Error(`Could not translate to "${targetLang}": ${e}`);
    }
}
exports.translateText = translateText;
//# sourceMappingURL=tools.js.map