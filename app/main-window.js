const { app, BrowserWindow } = require( 'electron' );
const windowStateKeeper = require( 'electron-window-state' );
const path = require( 'path' );

module.exports = function() {
	const windowState = windowStateKeeper( {
		defaultWidth: 600,
		defaultHeight: 400,
	} );

	let win = new BrowserWindow( {
		icon: path.resolve( __dirname, './resources/tray.png' ),
		width: 600,
		height: 400,
		// frame: false,
		// skipTaskbar: true,
		resizable: false,
		center: true,
		titleBarStyle: 'hidden',
	} );

	windowState.manage( win );

	win.loadURL( `file://${__dirname}/../dist/index.html` );
	win.on( 'closed', onClosed );
	win.webContents.on('will-navigate', event => {
		event.preventDefault();
		return false;
	});

	function onClosed() {
		win = null;
	}

	return win;
}
