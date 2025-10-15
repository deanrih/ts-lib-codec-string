import { describe, expect, it } from "bun:test";
import { base32Decode, base32Encode } from "../src";

interface Round {
	buffer: Buffer;
	plain?: string;
	base32: string;
	base64: string;
	hex: string;
}
const rounds: Round[] = [
	{ buffer: Buffer.from(""), plain: "", base32: "", base64: "", hex: "" },
	{ buffer: Buffer.from("a"), plain: "a", base32: "ME======", base64: "", hex: "" },
	{ buffer: Buffer.from("f"), plain: "f", base32: "MY======", base64: "", hex: "" },
	{ buffer: Buffer.from("fo"), plain: "fo", base32: "MZXQ====", base64: "", hex: "" },
	{ buffer: Buffer.from("foo"), plain: "foo", base32: "MZXW6===", base64: "", hex: "" },
	{ buffer: Buffer.from("foob"), plain: "foob", base32: "MZXW6YQ=", base64: "", hex: "" },

	{ buffer: Buffer.from("fooba"), plain: "fooba", base32: "MZXW6YTB", base64: "", hex: "" },
	{ buffer: Buffer.from("foobar"), plain: "foobar", base32: "MZXW6YTBOI======", base64: "", hex: "" },
	{
		buffer: Buffer.from("Base32Encoding.com"),
		plain: "Base32Encoding.com",
		base32: "IJQXGZJTGJCW4Y3PMRUW4ZZOMNXW2===",
		base64: "",
		hex: "",
	},
	{ buffer: Buffer.from("0"), plain: "0", base32: "GA======", base64: "", hex: "" },
	{
		buffer: Buffer.from("Base32 Encoding"),
		plain: "Base32 Encoding",
		base32: "IJQXGZJTGIQEK3TDN5SGS3TH",
		base64: "",
		hex: "",
	},
	{ buffer: Buffer.from("DiMolnar"), plain: "DiMolnar", base32: "IRUU233MNZQXE===", base64: "", hex: "" },
	{
		buffer: Buffer.from([...Buffer.from("Hello!"), 0xde, 0xad, 0xbe, 0xef]),
		plain: undefined,
		// plain: "Hello!Þ­¾ï",
		base32: "JBSWY3DPEHPK3PXP",
		base64: "",
		hex: "",
	},
];

describe("base32 plain", () => {
	for (const { base32, plain } of rounds) {
		if (plain !== undefined) {
			it(`encode/decode plain\t[${plain}] <==> [${base32}]`, () => {
				const resEnc = base32Encode(plain);
				const resDec = base32Decode(base32);

				expect(resEnc).toBe(base32);
				expect(resDec).toBe(plain);
				// expect(resDec).toBe("Hello!Þ­¾ï");
			});
		}
	}
});

describe("base32 buffer", () => {
	for (const { base32, buffer } of rounds) {
		it(`encode/decode buffer\t[${buffer}] <==> [${base32}]`, () => {
			const resEnc = base32Encode(buffer);
			// const resDec = base32Decode(base32);
			expect(resEnc).toBe(base32);
			// expect(resDec).toBe(plain);
			// expect(resDec).toBe("Hello!Þ­¾ï");
			// console.log(`[${resDec}]`);
		});
	}
});
