/** Build script to use esbuild without specifying 1000 CLI options */

const cliArgs = process.argv.slice(2);

// Overwrite/extend the default options by passing them to the CLI
const cliOptions = cliArgs
	.filter((arg) => arg.startsWith("--"))
	.map((arg) => arg.substr(2))
	.map((arg) => (arg.includes("=") ? arg.split("=", 2) : [arg, true]));

/** @type {Record<string, any>} */
let options = {};
for (const [key, value] of cliOptions) {
	options[key] = value;
}

if (cliArgs.includes("react")) {
	require("esbuild")
		.build({
			entryPoints: ["./admin/src/index"],
			bundle: true,
			minify: true,
			outdir: "admin/build",
			sourcemap: "external",
			logLevel: "info",
			define: {
				"process.env.NODE_ENV": '"production"',
			},
			...options,
		})
		.catch(() => process.exit(1));
}
