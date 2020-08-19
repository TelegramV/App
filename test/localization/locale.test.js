/*import Locale from "../../src/js/Api/Localization/Locale"
import VRDOM from "../../src/js/V/VRDOM/VRDOM"

Locale.strings = new Map(Object.entries({
    one: "{one} one replace",
    two: "{one} {two} two replaces",
    plural: {
        _plural: true,
        zero: "Plural zero: {replace}",
        one: "Plural one: {replace}",
        two: "Plural two: {replace}",
        few: "Plural few: {replace}",
        many: "Plural many: {replace}",
        other: "Plural other: {replace}"
    }
}))
Locale.langCode = "en"

test("Locale: Replaces", () => {
    expect(Locale.l("one", {
        one: "Foo"
    })).toStrictEqual(["Foo one replace"])

    expect(Locale.l("two", {
        one: "Foo",
        two: "Bar"
    })).toStrictEqual(["Foo Bar two replaces"])
})

test("Locale: Plural", () => {
    expect(Locale.lp("plural", 1, {
        replace: "Foo"
    })).toStrictEqual(["Plural one: Foo"])

    expect(Locale.l("plural", {
        replace: "Foo"
    })).toStrictEqual(["Plural one: Foo"])

    expect(Locale.lp("plural", 2, {
        replace: "Foo"
    })).toStrictEqual(["Plural other: Foo"])
})

test("Locale: VRNode", () => {
    const node = <span>Text</span>;
    const expected = [node, " one replace"];

    expect(Locale.lp("one", {
        one: node
    })).toStrictEqual(expected)
})*/

