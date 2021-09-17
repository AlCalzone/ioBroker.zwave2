import { expect } from "chai";
import { nameToStateId } from "./objects";

describe("lib/objects => nameToStateId()", () => {
	it(`should concat multiple words and camelCase them`, () => {
		const tests = [
			{ input: "foo bar", expected: "fooBar" },
			{ input: "foo Bar baz BOOP", expected: "fooBarBazBoop" },
		];
		for (const { input, expected } of tests) {
			expect(nameToStateId(input)).to.equal(expected);
		}
	});

	it(`does not choke on weird punctuation`, () => {
		const tests = [
			{ input: "foo bar :", expected: "fooBar" },
			{ input: "foo bar ::: ", expected: "fooBar" },
			{ input: "foo bar : : :", expected: "fooBar" },
			{ input: " : foo bar :", expected: "fooBar" },
			{ input: " :: foo bar ::: ", expected: "fooBar" },
			{ input: " : : :: foo,: !/ \0 bar : : :", expected: "fooBar" },
		];
		for (const { input, expected } of tests) {
			expect(nameToStateId(input)).to.equal(expected);
		}
	});

	it("does not choke on wordless strings", () => {
		const tests = [
			{ input: " ", expected: "" },
			{ input: " \t", expected: "" },
			{ input: " \t\r\n", expected: "" },
			{ input: " ", expected: "" },
			{ input: " \t.", expected: "" },
			{ input: " ... \t \r\n", expected: "" },
		];
		for (const { input, expected } of tests) {
			expect(nameToStateId(input)).to.equal(expected);
		}
	});

	it("does not change safe names", () => {
		const tests = ["fooBar", "fooBarBaz-Boop"];
		for (const name of tests) {
			expect(nameToStateId(name)).to.equal(name);
		}
	});
});
