import { barplot, bench, boxplot, do_not_optimize, run, summary, type k_state } from "mitata";

import { base32Decode, base32DecodeOld, base32Encode } from "~/internal/base32.internal";

const rounds = [
	"",
	"GE======",
	"GI======",
	"GM======",
	"ME======",
	"MI======",
	"MM======",
	"MY======",
	"MZXQ====",
	"MZXW6===",
	"MZXW6YQ=",
	"MZXW6YTB",
	"MZXW6YTBOI======",
	"IJQXGZJTGI======",
	"IJQXGZJTGJCW4Y3PMRUW4ZY=",
	"IJQXGZJTGJCW4Y3PMRUW4Z2UMVZXI===",
	"JBSWY3DPK5XXE3DEEE======",
	"JBSWY3DPEBLW64TMMQQQ====",

	// Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
	"JRXXEZLNEBUXA43VNUQGI33MN5ZCA43JOQQGC3LFOQWCAY3PNZZWKY3UMV2HK4RAMFSGS4DJONRWS3THEBSWY2LUFQQHGZLEEBSG6IDFNF2XG3LPMQQHIZLNOBXXEIDJNZRWSZDJMR2W45BAOV2CA3DBMJXXEZJAMV2CAZDPNRXXEZJANVQWO3TBEBQWY2LROVQQ====",
	// Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat
	"KV2CAZLONFWSAYLEEBWWS3TJNUQHMZLONFQW2LBAOF2WS4ZANZXXG5DSOVSCAZLYMVZGG2LUMF2GS33OEB2WY3DBNVRW6IDMMFRG64TJOMQG42LTNEQHK5BAMFWGS4LVNFYCAZLYEBSWCIDDN5WW233EN4QGG33OONSXC5LBOQ======",
	// Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
	"IR2WS4ZAMF2XIZJANFZHK4TFEBSG63DPOIQGS3RAOJSXA4TFNBSW4ZDFOJUXIIDJNYQHM33MOVYHIYLUMUQHMZLMNF2CAZLTONSSAY3JNRWHK3JAMRXWY33SMUQGK5JAMZ2WO2LBOQQG45LMNRQSA4DBOJUWC5DVOI======",
	// Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
	"IV4GGZLQORSXK4RAONUW45BAN5RWGYLFMNQXIIDDOVYGSZDBORQXIIDON5XCA4DSN5UWIZLOOQWCA43VNZ2CA2LOEBRXK3DQMEQHC5LJEBXWMZTJMNUWCIDEMVZWK4TVNZ2CA3LPNRWGS5BAMFXGS3JANFSCAZLTOQQGYYLCN5ZHK3I=",
];
const iterations = 1_000;

function benchLoop(handler: (value: string) => Buffer | string): (string | Buffer)[] {
	const results: (string | Buffer)[] = [];

	for (let idx = 0; idx < rounds.length; idx += 1) {
		const round = rounds[idx];
		const result = <string | Buffer>(do_not_optimize(handler(round)) as never);

		results.push(result);
	}

	return results;
}

// boxplot(() => {
barplot(() => {
	summary(() => {
		bench("decode string to buffer - new", () => {
			// bench("decode string to buffer - old array $round", function* (state: k_state) {
			for (let iter = 0; iter < iterations; iter += 1) {
				const _ = benchLoop((x) => base32Decode(x));
			}
			// yield () => do_not_optimize(base32Decode(state.get("round")));
		})
			// .args("round", rounds)
			.gc("inner");

		bench("decode string to buffer - old", () => {
			// bench("decode string to buffer - new buffer $round", function* (state: k_state) {
			for (let iter = 0; iter < iterations; iter += 1) {
				const _ = benchLoop((x) => base32DecodeOld(x));
			}
			// yield () => do_not_optimize(base32DecodeOpt(state.get("round")));
		})
			// .args("round", rounds)
			.gc("inner");
	});
});

await run();
