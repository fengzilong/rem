const { Tray } = require( 'electron' );
const trayMenu = require( './tray-menu' );

module.exports = function( options ) {
	const tray = new Tray( `${__dirname}/resources/tray.png` );
	tray.setToolTip( 'Rem' );
	tray.setContextMenu( trayMenu() );

	return tray;
};
