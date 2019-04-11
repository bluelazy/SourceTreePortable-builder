/**
 * Created by user on 2019/4/12.
 */

import fs = require('fs-extra');
import path = require('path');
import packageJson = require('../package.json');
import { __releases_SourceTreePortable, __root, __root_SourceTreePortable, _root_releases } from '../index';
import { console } from 'debug-color2';
import { async as crossSpawn } from 'cross-spawn-extra';
import ini = require('ini');

(async () =>
{
	const version = packageJson.config.version;

	let _bin = `D:\\Program Files (Portable)\\PortableApps\\PortableApps\\PortableApps.comInstaller\\PortableApps.comInstaller.exe`;

	console.log(`build .paf`);

	await crossSpawn(_bin, [
		__releases_SourceTreePortable,
	], {
		stdio: 'inherit',
		cwd: _root_releases,
	});

	console.log(`build done.`);

	let _path = path.join(__root_SourceTreePortable, 'App', 'AppInfo', 'appinfo.ini');

	let _ini: {
		Version: {
			PackageVersion: string,
			DisplayVersion: string,
		}
	} = await fs.readFile(_path, 'utf-8').then(ini.parse);

	console.log(`rename`, `SourceTreePortable_${_ini.Version.DisplayVersion}.paf.exe`, '=>', `SourceTreePortable.paf.exe`);

	await fs.move(path.join(_root_releases, `SourceTreePortable_${_ini.Version.DisplayVersion}.paf.exe`), path.join(_root_releases, `SourceTreePortable.paf.exe`), {
		// @ts-ignore
		overwrite: true,
		preserveTimestamps: true,
	})

})();
