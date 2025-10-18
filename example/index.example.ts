import { base32Decode, base32Encode } from "../src";

const plainText = "Hello World!";
const encoded = base32Encode(plainText);
const decoded = base32Decode(encoded);

console.log(encoded);
console.log(decoded);
console.log(decoded.toString("utf8"));