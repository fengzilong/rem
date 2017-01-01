const { ipcMain } = require( 'electron' );
const path = require( 'path' );
const mainWindow = require( './main-window' );
const parsePsd = require( './parse-psd' );
const getTmpDir = require( './get-tmpdir' );
const config = require( './config' );

ipcMain.on( 'parse-psd', function ( e, message ) {
	const sender = e.sender;
	const { filepath } = message;

	parsePsd( filepath ).then( parsed => {
		// save
		const tempPath = path.resolve(
			getTmpDir(),
			`rem-${ Date.now() }.png`
		);
		parsed.savePng( tempPath ).then( () => {
			sender.send( 'parse-psd-done-' + filepath, {
				tree: parsed.tree(),
				png: tempPath,
			} );
		} )
		.catch( e => {
			console.log( 'parse psd failed', e );
		} );
	} );
} );

ipcMain.on( 'fullscreen', function () {
	mainWindow().setFullScreen( true );
} );

ipcMain.on( 'minimize', function () {
	mainWindow().minimize();
} );

ipcMain.on( 'hide', function () {
	mainWindow().hide();
} );

ipcMain.on( 'close', function () {
	const win = mainWindow();
	win.close();
} );

ipcMain.on( 'focus', function () {
	mainWindow().focus();
} );

ipcMain.on( 'center', function () {
	mainWindow().center();
} );

ipcMain.on( 'resize', function ( e, { width, height } ) {
	const win = mainWindow();
	win.setContentSize( width, height, true );
	win.center();
} );

ipcMain.on( 'save-as-recent-file', function ( e, { name, path } ) {
	let recentFiles = config.get( 'recent-files' ) || [];

	let found;
	recentFiles.some( function ( v, i ) {
		if ( v.path === path ) {
			found = v;
			recentFiles.splice( i, 1 );
			return true;
		}

		return false;
	} );

	if ( found ) {
		recentFiles.unshift( found );
	} else {
		recentFiles.unshift( { name, path } );
	}

	recentFiles = recentFiles.slice( 0, 10 );

	config.set( 'recent-files', recentFiles );

	// tray().emit( 'rebuild' );
} );

ipcMain.on( 'rebuild-tray-contextmenu-recent-files', rebuildTrayContextMenu );

function rebuildTrayContextMenu() {
	// tray().emit( 'rebuild' );
}
