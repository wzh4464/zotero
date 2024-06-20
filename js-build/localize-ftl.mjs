import { ftlToJSON, JSONToFtl } from 'ftl-tx';
import fs from 'fs-extra';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ftlFileBaseNames as sourceFileBaseNames } from './config.js';
import { onError, onProgress, onSuccess } from './utils.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = join(ROOT, 'chrome', 'locale');
const TRANSIFEX_FILE_NAME = 'zotero.json';

function getLocaleDir(locale) {
	return join(localesDir, locale, 'zotero');
}

async function getFTL() {
	const t1 = performance.now();
	
	const foundLocales = (await fs.readdir(localesDir, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
		// Valid locale codes only
		.filter(name => /^[a-z]{2}(-[A-Z]{2})?$/.test(name));
	
	let count = 0;
	for (let locale of foundLocales) {
		// Skip source locale
		if (locale == 'en-US') {
			continue;
		}

		const jsonFilePath = join(getLocaleDir(locale), TRANSIFEX_FILE_NAME);
		let jsonFromTransifex = {};
		try {
			const json = await fs.readJSON(jsonFilePath);
			jsonFromTransifex = json;
		}
		catch (e) {
			// no .json file from transifex
		}

		for (let sourceFileBaseName of sourceFileBaseNames) {
			const ftlFilePath = join(getLocaleDir(locale), sourceFileBaseName + '.ftl');
			let jsonFromLocalFTL = {};
			try {
				const ftl = await fs.readFile(ftlFilePath, 'utf8');
				jsonFromLocalFTL = ftlToJSON(ftl);
			}
			catch (e) {
				// no local .ftl file
			}
			let jsonFromEnUSFTL = {};
			try {
				const enUSFtlPath = join(getLocaleDir('en-US'), sourceFileBaseName + '.ftl');
				const ftl = await fs.readFile(enUSFtlPath, 'utf8');
				jsonFromEnUSFTL = ftlToJSON(ftl);
			}
			catch (e) {
				console.warn(`No en-US .ftl file for ${sourceFileBaseName}.`);
			}
			const mergedSourceJSON = { ...jsonFromEnUSFTL, ...jsonFromLocalFTL };
			const sourceKeys = Object.keys(mergedSourceJSON);
			const translated = new Map();

			for (let key of sourceKeys) {
				if (key in jsonFromTransifex) {
					translated.set(key, jsonFromTransifex[key]);
				}
				else {
					translated.set(key, mergedSourceJSON[key]);
				}
			}

			const ftl = JSONToFtl(Object.fromEntries(translated));
			const outFtlPath = join(getLocaleDir(locale), sourceFileBaseName + '.ftl');
			await fs.outputFile(outFtlPath, ftl);
			onProgress(`${locale}/${sourceFileBaseName}.ftl`, null, 'localize');
			count++;
		}
	}
	
	const t2 = performance.now();
	return ({
		action: 'localize',
		count,
		totalCount: count,
		processingTime: t2 - t1
	});
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
	(async () => {
		try {
			onSuccess(await getFTL());
		}
		catch (err) {
			process.exitCode = 1;
			global.isError = true;
			onError(err);
		}
	})();
}
