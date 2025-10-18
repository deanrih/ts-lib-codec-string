/**
 * @file
 * Copyright (c) 2025 Dean Rikrik Ichsan Hakiki.
 * All rights reserved.
 *
 * This code is licensed under the MIT License.
 *
 * @license     MIT
 * @description Utility to convert string/byte to base32 characters and vice versa
 * @author      Dean Rikrik Ichsan Hakiki (deanrih)
 * @version     1.2.0
 * @copyright   Dean Rikrik Ichsan Hakiki 2025
 */

const base32Variant = ["base32", "base32hex", "crockford"] as const;
const base32EncodeMask = 0x1f; // 31 because 32 characters (from 0 -> 31);
const base32DecodeMask = 0xff; // 255, 1111_1111, isolate first byte
const base32PaddingRegExp = new RegExp(/=+/g);

type Base32Variant = (typeof base32Variant)[number];
type Base32OutputEncoding = "buffer" | "utf8";
type Base32EncodeInput = string | Buffer;

interface Base32Info {
	charset: string[];
	charsetReversed: Record<string, number>;
	addPadding: boolean;
}

interface Base32EncodingOptions {
	addPadding?: boolean;
	inputEncoding?: BufferEncoding;
	variant?: Base32Variant;
}
interface Base32EncodingBufferOptions extends Omit<Base32EncodingOptions, "inputEncoding"> {}
interface Base32EncodingStringOptions extends Base32EncodingOptions {}

interface Base32DecodingOptions {
	variant?: Base32Variant;
}

const base32Info: Record<Base32Variant, Base32Info> = {
	"base32": {
		charset: [
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
			"W",
			"X",
			"Y",
			"Z",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
		],
		charsetReversed: {
			"A": 0,
			"a": 0,
			"B": 1,
			"b": 1,
			"C": 2,
			"c": 2,
			"D": 3,
			"d": 3,
			"E": 4,
			"e": 4,
			"F": 5,
			"f": 5,
			"G": 6,
			"g": 6,
			"H": 7,
			"h": 7,
			"I": 8,
			"i": 8,
			"J": 9,
			"j": 9,
			"K": 10,
			"k": 10,
			"L": 11,
			"l": 11,
			"M": 12,
			"m": 12,
			"N": 13,
			"n": 13,
			"O": 14,
			"o": 14,
			"P": 15,
			"p": 15,
			"Q": 16,
			"q": 16,
			"R": 17,
			"r": 17,
			"S": 18,
			"s": 18,
			"T": 19,
			"t": 19,
			"U": 20,
			"u": 20,
			"V": 21,
			"v": 21,
			"W": 22,
			"w": 22,
			"X": 23,
			"x": 23,
			"Y": 24,
			"y": 24,
			"Z": 25,
			"z": 25,
			"2": 26,
			"3": 27,
			"4": 28,
			"5": 29,
			"6": 30,
			"7": 31,
		},
		addPadding: true,
	},
	"base32hex": {
		charset: [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"I",
			"J",
			"K",
			"L",
			"M",
			"N",
			"O",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"U",
			"V",
		],
		charsetReversed: {
			"0": 0,
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 4,
			"5": 5,
			"6": 6,
			"7": 7,
			"8": 8,
			"9": 9,
			"A": 10,
			"a": 10,
			"B": 11,
			"b": 11,
			"C": 12,
			"c": 12,
			"D": 13,
			"d": 13,
			"E": 14,
			"e": 14,
			"F": 15,
			"f": 15,
			"G": 16,
			"g": 16,
			"H": 17,
			"h": 17,
			"I": 18,
			"i": 18,
			"J": 19,
			"j": 19,
			"K": 20,
			"k": 20,
			"L": 21,
			"l": 21,
			"M": 22,
			"m": 22,
			"N": 23,
			"n": 23,
			"O": 24,
			"o": 24,
			"P": 25,
			"p": 25,
			"Q": 26,
			"q": 26,
			"R": 27,
			"r": 27,
			"S": 28,
			"s": 28,
			"T": 29,
			"t": 29,
			"U": 30,
			"u": 30,
			"V": 31,
			"v": 31,
		},
		addPadding: true,
	},
	"crockford": {
		charset: [
			"0",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"A",
			"B",
			"C",
			"D",
			"E",
			"F",
			"G",
			"H",
			"J",
			"K",
			"M",
			"N",
			"P",
			"Q",
			"R",
			"S",
			"T",
			"V",
			"W",
			"X",
			"Y",
			"Z",
		],
		charsetReversed: {
			"0": 0,
			"1": 1,
			"2": 2,
			"3": 3,
			"4": 4,
			"5": 5,
			"6": 6,
			"7": 7,
			"8": 8,
			"9": 9,
			"A": 10,
			"a": 10,
			"B": 11,
			"b": 11,
			"C": 12,
			"c": 12,
			"D": 13,
			"d": 13,
			"E": 14,
			"e": 14,
			"F": 15,
			"f": 15,
			"G": 16,
			"g": 16,
			"H": 17,
			"h": 17,
			"J": 18,
			"j": 18,
			"K": 19,
			"k": 19,
			"M": 20,
			"m": 20,
			"N": 21,
			"n": 21,
			"P": 22,
			"p": 22,
			"Q": 23,
			"q": 23,
			"R": 24,
			"r": 24,
			"S": 25,
			"s": 25,
			"T": 26,
			"t": 26,
			"V": 27,
			"v": 27,
			"W": 28,
			"w": 28,
			"X": 29,
			"x": 29,
			"Y": 30,
			"y": 30,
			"Z": 31,
			"z": 31,
		},
		addPadding: false,
	},
};

function base32Encode(input: Buffer, options?: Base32EncodingBufferOptions): string;
function base32Encode(input: string, options?: Base32EncodingStringOptions): string;
function base32Encode(input: Base32EncodeInput, options?: Base32EncodingOptions): string {
	const inputEncoding: BufferEncoding = options?.inputEncoding ?? "utf8";
	const variant: Base32Variant = options?.variant ?? "base32";
	const info: Base32Info = base32Info[variant];
	const addPadding = info.addPadding;
	const charset = info.charset;

	let buffer: Buffer;

	if (typeof input === "string") {
		buffer = Buffer.from(input, inputEncoding);
	} else {
		buffer = input;
	}

	let bits = 0;
	let byte = 0;
	let result = "";

	const length = buffer.length;

	for (let idx = 0; idx < length; idx += 1) {
		const current = buffer[idx];
		byte = (byte << 8) | current;
		bits += 8;

		while (bits >= 5) {
			bits -= 5;
			result += charset[(byte >>> bits) & base32EncodeMask];
		}
	}

	if (bits > 0) {
		result += charset[(byte << (5 - bits)) & base32EncodeMask];
	}

	if (!addPadding) {
		return result;
	}

	while (result.length % 8 !== 0) {
		result += "=";
	}

	return result;
}

function base32Decode(input: string, outputEncoding?: "buffer", options?: Base32DecodingOptions): Buffer;
function base32Decode(input: string, outputEncoding: "utf8", options?: Base32DecodingOptions): string;
function base32Decode(
	input: string,
	outputEncoding?: Base32OutputEncoding,
	options?: Base32DecodingOptions,
): Buffer | string {
	const variant: Base32Variant = options?.variant ?? "base32";
	const info: Base32Info = base32Info[variant];
	const charsetReversed = info.charsetReversed;

	input = input.trim().replaceAll(base32PaddingRegExp, "");

	let bits = 0;
	let byte = 0;
	let buffIdx = 0;

	const length = input.length;
	const buffer = Buffer.alloc(Math.floor((length * 5) / 8));

	for (let idx = 0; idx < length; idx += 1) {
		const current = input[idx];
		const charIdx = charsetReversed[current];

		if (charIdx === undefined) {
			// throw Error();
			continue;
		}

		byte = (byte << 5) | charIdx;
		bits += 5;

		if (bits >= 8) {
			bits -= 8;
			buffer[buffIdx++] = (byte >>> bits) & base32DecodeMask;
		}
	}

	if (outputEncoding === undefined || outputEncoding === "buffer") {
		return buffer;
	} else {
		return buffer.toString("utf8");
	}
}

function base32DecodeOld(input: string, outputEncoding?: "buffer", options?: Base32DecodingOptions): Buffer;
function base32DecodeOld(input: string, outputEncoding: "utf8", options?: Base32DecodingOptions): string;
function base32DecodeOld(
	input: string,
	outputEncoding?: Base32OutputEncoding,
	options?: Base32DecodingOptions,
): Buffer | string {
	const variant: Base32Variant = options?.variant ?? "base32";
	const info: Base32Info = base32Info[variant];
	const charsetReversed = info.charsetReversed;

	input = input.trim().replaceAll(base32PaddingRegExp, "");

	let bits = 0;
	let byte = 0;
	const resultBuffer: number[] = [];
	const length = input.length;

	for (let idx = 0; idx < length; idx += 1) {
		const current = input[idx];
		const charIdx = charsetReversed[current];

		if (charIdx === undefined) {
			// throw Error();
			continue;
		}

		byte = (byte << 5) | charIdx;
		bits += 5;

		if (bits >= 8) {
			bits -= 8;
			resultBuffer.push((byte >>> bits) & 0xff);
		}
	}

	const result = Buffer.from(resultBuffer);

	if (outputEncoding === undefined || outputEncoding === "buffer") {
		return result;
	} else {
		return result.toString("utf8");
	}
}

export { base32Decode, base32DecodeOld, base32Encode };
