const { ipcMain } = require( 'electron' );
const path = require( 'path' );
const mainWindow = require( './main-window' );
const parsePsd = require( './parse-psd' );
const getTmpDir = require( './get-tmpdir' );

ipcMain.on( 'parse-psd', function( e, message ) {
	const sender = e.sender;
	const { filepath, filename } = message;

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
		} );
	} );
} );

ipcMain.on( 'fullscreen', function( e, message ) {
	mainWindow().setFullScreen( true );
} );

ipcMain.on( 'resizeWidth', function( e, width ) {
	const mainWin = mainWindow();
	const height = 600;
	mainWin.setContentSize( width, height, true );
	mainWin.center();
} );
