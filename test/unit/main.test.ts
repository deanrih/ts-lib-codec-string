import { describe, expect, it } from "bun:test";
import { base32Decode, base32DecodeOld, base32Encode } from "~/internal/base32.internal";

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
	[
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
		"JRXXEZLNEBUXA43VNUQGI33MN5ZCA43JOQQGC3LFOQWCAY3PNZZWKY3UMV2HK4RAMFSGS4DJONRWS3THEBSWY2LUFQQHGZLEEBSG6IDFNF2XG3LPMQQHIZLNOBXXEIDJNZRWSZDJMR2W45BAOV2CA3DBMJXXEZJAMV2CAZDPNRXXEZJANVQWO3TBEBQWY2LROVQQ====",
	],
	[
		"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
		"KV2CAZLONFWSAYLEEBWWS3TJNUQHMZLONFQW2LBAOF2WS4ZANZXXG5DSOVSCAZLYMVZGG2LUMF2GS33OEB2WY3DBNVRW6IDMMFRG64TJOMQG42LTNEQHK5BAMFWGS4LVNFYCAZLYEBSWCIDDN5WW233EN4QGG33OONSXC5LBOQ======",
	],
	[
		"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
		"IR2WS4ZAMF2XIZJANFZHK4TFEBSG63DPOIQGS3RAOJSXA4TFNBSW4ZDFOJUXIIDJNYQHM33MOVYHIYLUMUQHMZLMNF2CAZLTONSSAY3JNRWHK3JAMRXWY33SMUQGK5JAMZ2WO2LBOQQG45LMNRQSA4DBOJUWC5DVOI======",
	],
	[
		"Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
		"IV4GGZLQORSXK4RAONUW45BAN5RWGYLFMNQXIIDDOVYGSZDBORQXIIDON5XCA4DSN5UWIZLOOQWCA43VNZ2CA2LOEBRXK3DQMEQHC5LJEBXWMZTJMNUWCIDEMVZWK4TVNZ2CA3LPNRWGS5BAMFXGS3JANFSCAZLTOQQGYYLCN5ZHK3I=",
	],
];

// [buffer, base32]
const sourceBuffer = [
	...sourceString.map(([value, expected]) => {
		return [Buffer.from(value), expected];
	}),
	[Buffer.from([...Buffer.from("Hello!"), 0xde, 0xad, 0xbe, 0xef]), "JBSWY3DPEHPK3PXP"],
];

const stringRounds: Round[] = generateStringRoundFromArray(sourceString);
const bufferRounds: Round[] = generateBufferRoundFromArray(sourceBuffer);

const dotLength = 2;
const maxTitleLength = 32;
const halfs = maxTitleLength / 2 - dotLength;
const secondHalfs = maxTitleLength - halfs;

describe("base32 with string", () => {
	for (const round of stringRounds) {
		const input = <string>round.input;
		const inputTitle = `${round.input}`;
		const inputTitleWidth = Bun.stringWidth(inputTitle);

		const repeatAmount = Math.max(0, maxTitleLength - inputTitleWidth);
		const padding = " ".repeat(repeatAmount);
		const title =
			input.length >= maxTitleLength
				? `${inputTitle.slice(0, halfs)}....${inputTitle.slice(secondHalfs, maxTitleLength)}`
				: inputTitle;

		it(`string ${padding}[${title}] = enc, enc -> dec buf, enc -> dec str, sanity check`, () => {
			const tt = round.truthTable;

			const resEncString = base32Encode(input);
			const resDecBuffer = base32Decode(resEncString);
			const resDecString = base32Decode(resEncString, "utf8");

			const resDecBufferOld = base32DecodeOld(resEncString);
			const resDecStringOld = base32DecodeOld(resEncString, "utf8");

			expect(resEncString).toEqual(tt.base32);

			expect(resDecBuffer).toEqual(tt.buffer);
			expect(resDecString).toEqual(tt.string);

			expect(resDecBufferOld).toEqual(tt.buffer);
			expect(resDecStringOld).toEqual(tt.string);

			expect(resDecBuffer).toEqual(resDecBufferOld);
			expect(resDecString).toEqual(resDecStringOld);
		});
	}
});

describe("base32 with buffer", () => {
	for (const round of bufferRounds) {
		const input = <Buffer>round.input;
		const inputTitle = `${round.input}`;
		const inputTitleWidth = Bun.stringWidth(inputTitle);

		const repeatAmount = Math.max(0, maxTitleLength - inputTitleWidth);
		const padding = " ".repeat(repeatAmount);
		const title =
			input.length >= maxTitleLength
				? `${inputTitle.slice(0, halfs)}....${inputTitle.slice(secondHalfs, maxTitleLength)}`
				: inputTitle;

		it(`buffer ${padding}[${title}] = enc, enc -> dec buf, enc -> dec str, sanity check`, () => {
			const tt = round.truthTable;

			const resEncString = base32Encode(input);
			const resDecBuffer = base32Decode(resEncString);
			const resDecString = base32Decode(resEncString, "utf8");

			const resDecBufferOld = base32DecodeOld(resEncString);
			const resDecStringOld = base32DecodeOld(resEncString, "utf8");

			expect(resEncString).toEqual(tt.base32);

			expect(resDecBuffer).toEqual(tt.buffer);
			expect(resDecString).toEqual(tt.string);

			expect(resDecBufferOld).toEqual(tt.buffer);
			expect(resDecStringOld).toEqual(tt.string);

			expect(resDecBuffer).toEqual(resDecBufferOld);
			expect(resDecString).toEqual(resDecStringOld);
		});
	}
});
