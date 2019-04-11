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

	let _bin = `D:\\Program Files (Portable)\\PortableApps\\PortableApps\\PortableApps.comLauncher\\PortableApps.comLauncherGenerator.exe`;

	console.log(`build .exe`);

	await crossSpawn(_bin, [
		__releases_SourceTreePortable,
	], {
		stdio: 'inherit',
		cwd: _root_releases,
	});

	console.log(`build done.`);

})();
