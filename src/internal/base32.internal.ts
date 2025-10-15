/**
 * @file
 * Copyright (c) 2025 Dean Rikrik Ichsan Hakiki.
 * All rights reserved.
 *
 * This code is licensed under the MIT License.
 *
 * @license     MIT
 * @description Utility to work with environment variables utilizing schema type validation of typebox.
 * @author      Dean Rikrik Ichsan Hakiki (deanrih)
 * @version     1.0.0
 * @copyright   Dean Rikrik Ichsan Hakiki 2025
 */

const base32Variant = ["base32", "base32hex", "crockford"] as const;
type Base32Variant = (typeof base32Variant)[number];
type Base32Charset = Record<Base32Variant, string>;
type Base32Padding = Record<Base32Variant, boolean>;

interface Base32EncodingOptions {
	variant: Base32Variant;
	inputEncoding: BufferEncoding;
	addPadding?: boolean;
}
interface Base32DecodingOptions {
	variant: Base32Variant;
}

const base32Charset: Base32Charset = {
	"base32": "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
	"base32hex": "0123456789ABCDEFGHIJKLMNOPQRSTUV",
	"crockford": "0123456789ABCDEFGHJKMNPQRSTVWXYZ",
};
const base32Padding: Base32Padding = {
	"base32": true,
	"base32hex": true,
	"crockford": false,
};

// string | NodeJS.TypedArray | ArrayBufferLike
// string | NodeJS.TypedArray | DataView | ArrayBufferView
// type Base32Input = NodeJS.TypedArray;
type Base32Input = string | Uint8Array | ArrayBufferLike;
function base32Encode(
	input: Base32Input,
	options: Base32EncodingOptions = { inputEncoding: "utf8", variant: "base32" },
): string {
	const charset = base32Charset[options.variant];
	const addPadding = options.addPadding ?? base32Padding[options.variant];
	let buffer: Buffer;

	if (input instanceof Buffer) {
		buffer = input;
	} else if (input instanceof Uint8Array) {
		buffer = Buffer.from(input);
	} else if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) {
		buffer = Buffer.from(input);
	} else {
		buffer = Buffer.from(input, options.inputEncoding);
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
			result += charset[(byte >>> bits) & 31];
		}
	}

	if (bits > 0) {
		result += charset[(byte << (5 - bits)) & 31];
	}

	if (!addPadding) {
		return result;
	}

	while (result.length % 8 !== 0) {
		result += "=";
	}

	return result;
}

function base32Decode(input: string, options: Base32DecodingOptions = { variant: "base32" }): string {
	const charset = base32Charset[options.variant];

	input = input.trim().replaceAll(/=+/g, "");

	const length = input.length;

	let bits = 0;
	let byte = 0;
	let result = "";

	for (let idx = 0; idx < length; idx += 1) {
		const current = input[idx];
		if (current === undefined) {
			throw Error();
		}

		const charIdx = charset.indexOf(current);

		if (charIdx === -1) {
			throw Error();
		}

		byte = (byte << 5) | charIdx;
		bits += 5;

		if (bits >= 8) {
			bits -= 8;
			result += String.fromCharCode((byte >>> bits) & 255);
		}
	}

	return result;
}
export { base32Encode, base32Decode };
