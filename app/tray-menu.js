const { Menu } = require( 'electron' );
const mainWindow = require( './main-window' );
const config = require( './config' );

module.exports = function createTrayMenu( options ) {
	const recentFiles = config.get( 'recent-files' ) || [];

	const menus = [
		{
			label: 'open',
			type: 'normal',
			click() {
				const win = mainWindow();
				win.setContentSize( 400, 260, true );
				win.webContents.send( 'go-drop' );
				win.show();
				win.center();
			},
		},
		{ type: 'separator' },
	];

	[].push.apply( menus, recentFiles.map( ( { name, path } ) => {
		return { label: name, type: 'radio', click() {
			const win = mainWindow();
			win.webContents.send( 'go-preview', { name, path } );
			setTimeout( () => {
				win.show();
				win.center();
				win.focus();
			}, 100 );
		} };
	} ) );

	if ( recentFiles.length > 0 ) {
		menus.push( { type: 'separator' } );
		menus.push( {
			label: 'clear',
			type: 'normal',
			click() {
				config.delete( 'recent-files' )
			},
		} );
		menus.push( { type: 'separator' } );
	}

	const trayMenu = Menu.buildFromTemplate( [
		...menus,
		{ label: 'quit', type: 'normal', role: 'quit' },
	] );

	return trayMenu;
}
