const { Menu } = require( 'electron' );
const mainWindow = require( './main-window' );
const config = require( './config' );

module.exports = function createTrayMenu( options ) {
	const recentFiles = config.get( 'recent-files' );

	const trayMenu = Menu.buildFromTemplate( [
		{
			label: 'reset',
			type: 'normal',
			click() {
				const win = mainWindow();
				win.webContents.send( 'go-drop' );
				win.setContentSize( 400, 260, true );
				win.center();
				win.focus();
			}
		},
		{
			label: 'recent files',
			type: 'submenu',
			submenu: recentFiles.map( v => {
				return { label: v.name, type: 'normal', click() {
					const win = mainWindow();
					win.webContents.send( 'go-preview', {
						name: v.name,
						path: v.path,
					} );
					win.center();
					win.focus();
				} };
			} ),
		},
		{ label: 'quit', type: 'normal', role: 'quit' },
	] );

	return trayMenu;
}
