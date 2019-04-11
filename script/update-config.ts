/**
 * Created by user on 2019/4/12.
 */

import fs = require('fs-extra');
import path = require('path');
import packageJson = require('../package.json');
import { __releases_SourceTreePortable, __root_SourceTreePortable } from '../index';
import { console } from 'debug-color2';
import ini = require('ini');

(async () =>
{
	const version = packageJson.config.version;

	let _path = path.join(__root_SourceTreePortable, 'App', 'AppInfo', 'appinfo.ini');

	let _ini: {
		Version: {
			PackageVersion: string,
			DisplayVersion: string,
		}
	} = await fs.readFile(_path, 'utf-8').then(ini.parse);

	_ini.Version.PackageVersion = version;
	_ini.Version.DisplayVersion = version.split('.').slice(0, 3).join('.');

	// @ts-ignore
	console.dir(_ini.Version);

	await fs.writeFile(_path, ini.stringify(_ini));

	let _nsh_context = `
!macro CustomCodePostInstall

; Prepare folder to extract with 7zip
CreateDirectory "$INSTDIR\\7zTemp"
SetOutPath "$INSTDIR\\7zTemp"
File "\${NSISDIR}\\..\\7zip\\7z.exe"
File "\${NSISDIR}\\..\\7zip\\7z.dll"
SetOutPath $INSTDIR
CreateDirectory "$INSTDIR\\Data"

inetc::get /CONNECTTIMEOUT 30 /NOCOOKIES /TRANSLATE "Downloading SourceTree..." "Connecting..." second minute hour s "%dkB (%d%%) of %dkB @ %d.%01dkB/s" " (%d %s%s remaining)" "https://product-downloads.atlassian.com/software/sourcetree/windows/ga/SourceTreeSetup-${_ini.Version.DisplayVersion}.exe" "$INSTDIR\\7zTemp\\SourceTreeSetup-${_ini.Version.DisplayVersion}.exe" /END

; Extract
ExecDOS::exec \`"$INSTDIR\\7zTemp\\7z.exe" e "$INSTDIR\\7zTemp\\SourceTreeSetup-${_ini.Version.DisplayVersion}.exe" "SourceTree-${_ini.Version.DisplayVersion}-full.nupkg" -o"$INSTDIR\\7zTemp"\` "" ""
ExecDOS::exec \`"$INSTDIR\\7zTemp\\7z.exe" x "$INSTDIR\\7zTemp\\SourceTree-${_ini.Version.DisplayVersion}-full.nupkg" "lib\\net45" -o"$INSTDIR\\7zTemp"\` "" ""
ExecDOS::exec \`xcopy "$INSTDIR\\7zTemp\\lib\\net45" "$INSTDIR\\App\\SourceTree" /S /i\` "" ""

; Cleanup
RMDir /r "$INSTDIR\\7zTemp"

!macroend

`;

	await fs.writeFile(path.join(__root_SourceTreePortable, 'Other/Source/PortableApps.comInstallerCustom.nsh'), _nsh_context);

//	console.dir(_ini);

})();
