const { app, BrowserWindow } = require( 'electron' );
const windowStateKeeper = require( 'electron-window-state' );
const path = require( 'path' );

let win;
module.exports = function() {
	if ( win ) {
		return win;
	}

	const windowState = windowStateKeeper( {
		defaultWidth: 400,
		defaultHeight: 260,
	} );

	win = new BrowserWindow( {
		show: false,
		icon: path.resolve( __dirname, './resources/icon_original.png' ),
		width: 400,
		height: 260,
		frame: false,
		resizable: false,
		center: true,
		titleBarStyle: 'hidden',
		backgroundColor: '#FFF',
		skipTaskbar: true,
	} );

	windowState.manage( win );

	win.loadURL( `file://${__dirname}/../dist/index.html` );
	win.once( 'ready-to-show', function () {
		win.show();
	} );
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
