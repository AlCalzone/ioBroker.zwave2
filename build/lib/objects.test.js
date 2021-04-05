var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};
var import_objects = __toModule(require("./objects"));
describe("lib/objects => nameToStateId()", () => {
  it(`should concat multiple words and camelCase them`, () => {
    const tests = [
      {input: "foo bar", expected: "fooBar"},
      {input: "foo Bar baz BOOP", expected: "fooBarBazBoop"}
    ];
    for (const {input, expected} of tests) {
      expect((0, import_objects.nameToStateId)(input)).toBe(expected);
    }
  });
  it(`does not choke on weird punctuation`, () => {
    const tests = [
      {input: "foo bar :", expected: "fooBar"},
      {input: "foo bar ::: ", expected: "fooBar"},
      {input: "foo bar : : :", expected: "fooBar"},
      {input: " : foo bar :", expected: "fooBar"},
      {input: " :: foo bar ::: ", expected: "fooBar"},
      {input: " : : :: foo,: !/ \0 bar : : :", expected: "fooBar"}
    ];
    for (const {input, expected} of tests) {
      expect((0, import_objects.nameToStateId)(input)).toBe(expected);
    }
  });
  it("does not choke on wordless strings", () => {
    const tests = [
      {input: " ", expected: ""},
      {input: " 	", expected: ""},
      {input: " 	\r\n", expected: ""},
      {input: " ", expected: ""},
      {input: " 	.", expected: ""},
      {input: " ... 	 \r\n", expected: ""}
    ];
    for (const {input, expected} of tests) {
      expect((0, import_objects.nameToStateId)(input)).toBe(expected);
    }
  });
  it("does not change safe names", () => {
    const tests = ["fooBar", "fooBarBaz-Boop"];
    for (const name of tests) {
      expect((0, import_objects.nameToStateId)(name)).toBe(name);
    }
  });
});
