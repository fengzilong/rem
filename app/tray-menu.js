const { Menu } = require( 'electron' );

module.exports = function createTrayMenu( options ) {
	const trayMenu = Menu.buildFromTemplate( [
		{ label: 'recent files', type: 'submenu', submenu: [
			{ label: 'file1', type: 'normal' },
			{ label: 'file2', type: 'normal' },
			{ label: 'file3', type: 'normal' },
		] },
		{ label: 'quit', type: 'normal', role: 'quit' },
	] );

	return trayMenu;
}
