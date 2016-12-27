const { Tray } = require( 'electron' );
const mainWindow = require( './main-window' );
const trayMenu = require( './tray-menu' );

let tray;
module.exports = function( options ) {
	if ( tray ) {
		return tray;
	}

	tray = new Tray( `${__dirname}/resources/icon.png` );
	tray.setToolTip( 'Rem' );

	// tray.on( 'rebuild', function () {
	// 	tray.setContextMenu( trayMenu() );
	// } );

	tray.on( 'click', () => {
		tray.popUpContextMenu( trayMenu() );
	} );

	return tray;
};
