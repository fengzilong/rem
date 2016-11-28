const { Menu } = require( 'electron' );
const mainWindow = require( './main-window' );
const config = require( './config' );

module.exports = function createTrayMenu( options ) {
	const recentFiles = config.get( 'recent-files' ) || [];

	const trayMenu = Menu.buildFromTemplate( [
		{
			label: 'recent files',
			type: 'submenu',
			submenu: recentFiles.map( ( { name, path } ) => {
				return { label: name, type: 'normal', click() {
					const win = mainWindow();
					win.webContents.send( 'go-preview', { name, path } );
					setTimeout( () => {
						win.show();
						win.center();
						win.focus();
					}, 100 );
				} };
			} ),
		},
		{ label: 'quit', type: 'normal', role: 'quit' },
	] );

	return trayMenu;
}
