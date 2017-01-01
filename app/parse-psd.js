const PSD = require( 'psd' );

module.exports = function ( path ) {
	return PSD.open( path )
		.then( psd => {
			return {
				savePng( savePath ) {
					return psd.image.saveAsPng( savePath );
				},
				tree() {
					return psd.tree().export();
				}
			};
		} );
};
