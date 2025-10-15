import { $ } from "bun";
import { build, type Options } from "tsup";

const config = {
	bundle: true,
	clean: true,
	dts: true,
	entry: ["./src/**/*.ts"],
	minify: true,
	outDir: "./dist",
	sourcemap: false,
	splitting: false,
	// target: ["node24", "node25", "es2024", "esnext"],
	target: "esnext",
	treeshake: "smallest",
	format: "esm",
} satisfies Options;

await $`rm -rf ./dist`;

await build(config);

// await await Promise.all([
// 	build({
// 		...config,
// 		format: "cjs",
// 	}),
// 	build({
// 		...config,
// 		format: "esm",
// 		outExtension: () => {
// 			return { js: ".mjs" };
// 		},
// 	}),
// ]);
