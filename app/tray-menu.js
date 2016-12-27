const { Menu } = require( 'electron' );
const mainWindow = require( './main-window' );
const config = require( './config' );

module.exports = function createTrayMenu( options ) {
	const recentFiles = config.get( 'recent-files' ) || [];

	const menus = recentFiles.map( ( { name, path } ) => {
		return { label: name, type: 'radio', click() {
			const win = mainWindow();
			win.webContents.send( 'go-preview', { name, path } );
			setTimeout( () => {
				win.show();
				win.center();
				win.focus();
			}, 100 );
		} };
	} );

	if ( menus.length > 0 ) {
		menus.push( { type: 'separator' } );
		menus.push( {
			label: 'clear',
			type: 'normal',
			click() {
				config.delete( 'recent-files' )
			},
		} );
	} else {
		menus.unshift( { type: 'separator' } );
		menus.unshift( {
			label: 'open',
			type: 'normal',
			click() {
				const win = mainWindow();
				win.show();
			},
		} );
	}

	const trayMenu = Menu.buildFromTemplate( [
		...menus,
		{ label: 'quit', type: 'normal', role: 'quit' },
	] );

	return trayMenu;
}
