const fs = require( 'fs' );

export default function( filepath ) {
	try {
		const buffer = fs.readFileSync( filepath );
		const blob = new window.Blob( [ new Uint8Array( buffer ) ] );
		const blobUrl = webkitURL.createObjectURL( blob );
		return blobUrl;
	} catch( e ) {}
}
