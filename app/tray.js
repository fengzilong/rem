const { Tray } = require( 'electron' );
const trayMenu = require( './tray-menu' );

let tray;
module.exports = function () {
	if ( tray ) {
		return tray;
	}

	tray = new Tray( `${ __dirname }/resources/icon.png` );
	tray.setToolTip( 'Rem' );

	// tray.on( 'rebuild', function () {
	// 	tray.setContextMenu( trayMenu() );
	// } );

	tray.on( 'click', () => {
		tray.popUpContextMenu( trayMenu() );
	} );

	return tray;
};
