/**
 * Created by user on 2019/4/11.
 */

import fs = require('fs-extra');
import path = require('path');
import packageJson = require('../package.json');
import { __releases_SourceTreePortable, __root_SourceTreePortable } from '../index';
import { console } from 'debug-color2';

(async () =>
{
	const version = packageJson.config.version;
	const hash = packageJson.config.hash;

	console.log(`remove`, __releases_SourceTreePortable);
	await fs.remove(__releases_SourceTreePortable).catch(e => console.error(e.message));

	let _path_data_app = path.join(__releases_SourceTreePortable, 'Data', 'ClientFiles', `SourceTree.exe_Url_${hash}`, version);

	let _path_default_data = path.join(__releases_SourceTreePortable, 'App/DefaultData');

	//await fs.ensureDir(_path_data_app);

	await copy(__root_SourceTreePortable, __releases_SourceTreePortable);

	//await copy(path.join(__root_SourceTreePortable, 'App/DefaultData/user.config'), path.join(_path_data_app, 'user.config'));
	await copy(path.join(__root_SourceTreePortable, 'App/DefaultData/user.config'), path.join(__releases_SourceTreePortable, 'Data', 'user.config'));

	//await copy(path.join(__releases_SourceTreePortable, 'Data', 'ClientFiles'), path.join(__releases_SourceTreePortable, 'App/DefaultData/ClientFiles'));

})();

function copy(from: string, to: string)
{
	console.log('copy', to);

	return fs.copy(from, to, {
		overwrite: true,
		preserveTimestamps: true,
	});
}
