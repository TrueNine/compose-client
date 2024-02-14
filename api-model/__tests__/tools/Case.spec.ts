import { expect, test } from "vitest";

test("VueRouter", async () => {
    function camelTo(str: string, sep: string = "/") {
        if (str.includes("-")) return str.replaceAll("-", sep).toLowerCase();
        return str.replace(/([stepNodes-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase();
    }
    expect(camelTo("LoginRegister")).toStrictEqual("login/register");
    expect(camelTo("login-register")).toStrictEqual("login/register");
});
