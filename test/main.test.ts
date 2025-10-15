import { describe, expect, it } from "bun:test";
import { base32Decode, base32Encode } from "../src";

interface TruthTable {
	buffer: Buffer;
	string: string;
	base32: string;
}

interface Round {
	input: Buffer | string;
	truthTable: TruthTable;
}

function generateStringRoundFromArray(input: string[][]): Round[] {
	return input.map((x) => {
		return <Round>{
			input: x[0],
			truthTable: {
				buffer: Buffer.from(x[0]),
				string: x[0],
				base32: x[1],
			},
		};
	});
}

function generateBufferRoundFromArray(input: (string | Buffer)[][]): Round[] {
	return input.map((x) => {
		return <Round>{
			input: <Buffer>x[0],
			truthTable: {
				buffer: <Buffer>x[0],
				string: (<Buffer>x[0]).toString("utf8"),
				base32: x[1],
			},
		};
	});
}

// [buffer, base32]
const sourceBuffer = [
	[Buffer.from(""), ""],
	[Buffer.from("1"), "GE======"],
	[Buffer.from("2"), "GI======"],
	[Buffer.from("3"), "GM======"],
	[Buffer.from("a"), "ME======"],
	[Buffer.from("b"), "MI======"],
	[Buffer.from("c"), "MM======"],
	[Buffer.from("f"), "MY======"],
	[Buffer.from("fo"), "MZXQ===="],
	[Buffer.from("foo"), "MZXW6==="],
	[Buffer.from("foob"), "MZXW6YQ="],
	[Buffer.from("fooba"), "MZXW6YTB"],
	[Buffer.from("foobar"), "MZXW6YTBOI======"],
	[Buffer.from("Base32"), "IJQXGZJTGI======"],
	[Buffer.from("Base32Encoding"), "IJQXGZJTGJCW4Y3PMRUW4ZY="],
	[Buffer.from("Base32EncodingTest"), "IJQXGZJTGJCW4Y3PMRUW4Z2UMVZXI==="],
	[Buffer.from("HelloWorld!"), "JBSWY3DPK5XXE3DEEE======"],
	[Buffer.from("Hello World!"), "JBSWY3DPEBLW64TMMQQQ===="],
	[Buffer.from([...Buffer.from("Hello!"), 0xde, 0xad, 0xbe, 0xef]), "JBSWY3DPEHPK3PXP"],
];
// [string, base32]
const sourceString = [
	["", ""],
	["1", "GE======"],
	["2", "GI======"],
	["3", "GM======"],
	["a", "ME======"],
	["b", "MI======"],
	["c", "MM======"],
	["f", "MY======"],
	["fo", "MZXQ===="],
	["foo", "MZXW6==="],
	["foob", "MZXW6YQ="],
	["fooba", "MZXW6YTB"],
	["foobar", "MZXW6YTBOI======"],
	["Base32", "IJQXGZJTGI======"],
	["Base32Encoding", "IJQXGZJTGJCW4Y3PMRUW4ZY="],
	["Base32EncodingTest", "IJQXGZJTGJCW4Y3PMRUW4Z2UMVZXI==="],
	["HelloWorld!", "JBSWY3DPK5XXE3DEEE======"],
	["Hello World!", "JBSWY3DPEBLW64TMMQQQ===="],
];

const bufferRounds: Round[] = generateBufferRoundFromArray(sourceBuffer);
const stringRounds: Round[] = generateStringRoundFromArray(sourceString);

describe("base32 with buffer", () => {
	for (const round of bufferRounds) {
		const input = <Buffer>round.input;
		const stringWidth = Bun.stringWidth(`${round.input}`);
		const testTitle = [" ".repeat(20 - stringWidth), `${round.input}`].join("");
		it(`buffer [${testTitle}] = enc, enc -> dec buf, enc -> dec str`, () => {
			const tt = round.truthTable;

			const resEncString = base32Encode(input);
			const resDecBuffer = base32Decode(resEncString);
			const resDecString = base32Decode(resEncString, "utf8");

			expect(resEncString).toEqual(tt.base32);
			expect(resDecBuffer).toEqual(tt.buffer);
			expect(resDecString).toEqual(tt.string);
		});
	}
});

describe("base32 with string", () => {
	for (const round of stringRounds) {
		const input = <string>round.input;
		const stringWidth = Bun.stringWidth(input);
		const testTitle = [" ".repeat(20 - stringWidth), input].join("");
		it(`string [${testTitle}] = enc, enc -> dec buf, enc -> dec str`, () => {
			const tt = round.truthTable;

			const resEncString = base32Encode(input);
			const resDecBuffer = base32Decode(resEncString);
			const resDecString = base32Decode(resEncString, "utf8");

			expect(resEncString).toEqual(tt.base32);
			expect(resDecBuffer).toEqual(tt.buffer);
			expect(resDecString).toEqual(tt.string);
		});
	}
});
