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
	tray.setContextMenu( trayMenu() );

	tray.on( 'rebuild', function () {
		tray.setContextMenu( trayMenu() );
	} );

	tray.on( 'click', () => {
		const win = mainWindow();
		if ( win.isVisible() ) {
			win.hide();
		} else {
			win.show();
		}
	} );

	return tray;
};
