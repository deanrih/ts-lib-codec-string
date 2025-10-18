# @deanrih/ts-lib-codec-string

<desc>

## Installation

```sh
# Bun
bun add @deanrih/ts-lib-codec-string
# pnpm
pnpm add @deanrih/ts-lib-codec-string
# npm
npm install @deanrih/ts-lib-codec-string
```

## Usage

```ts
import { base32Decode, base32Encode } from "@deanrih/ts-lib-codec-string";

const plainText = "Hello World!";
const encoded = base32Encode(plainText);
const decoded = base32Decode(encoded);

console.log(encoded);
console.log(decoded);
console.log(decoded.toString("utf8"));
```

Checkout the [example](https://github.com/deanrih/ts-lib-codec-string/blob/main/example) folder.

## Credits/Reference
