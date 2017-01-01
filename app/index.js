'use strict';
const { app } = require( 'electron' );
const createTray = require( './tray' );
const createMainWindow = require( './main-window' );
require( './ipc' );
require( 'electron-debug' )();

let mainWindow;

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
