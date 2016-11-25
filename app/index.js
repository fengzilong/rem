'use strict';
const { app, BrowserWindow } = require( 'electron' );
const path = require( 'path' );
const createTray = require( './tray' );
const createMainWindow = require( './main-window' );
const ipc = require( './ipc' );

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
