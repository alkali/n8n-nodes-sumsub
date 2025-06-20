import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['credentials/*.ts'],
	format: ['cjs'],
	dts: false,
	bundle: false,
	sourcemap: true,
	silent: true,
	clear: true,
	outDir: 'dist/credentials/',
});
