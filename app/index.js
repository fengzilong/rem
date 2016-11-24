'use strict';
const { app, BrowserWindow } = require( 'electron' );
const windowStateKeeper = require( 'electron-window-state' );
const path = require( 'path' );
const createTray = require( './create-tray' );

require( 'electron-debug' )();

let mainWindow;

function onClosed() {
	mainWindow = null;
}

function createMainWindow() {
	const windowState = windowStateKeeper( {
		defaultWidth: 600,
		defaultHeight: 400,
	} );

	const win = new BrowserWindow( {
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

	win.loadURL( `file://${__dirname}/../client/index.html` );
	win.on( 'closed', onClosed );

	return win;
}

app.on( 'window-all-closed', () => {
	if ( process.platform !== 'darwin' ) {
		app.quit();
	}
} );

app.on( 'activate', () => {
	if ( !mainWindow ) {
		mainWindow = createMainWindow();
	}
} );

app.on( 'ready', () => {
	createTray();
	mainWindow = createMainWindow();
} );
