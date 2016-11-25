export default function walk( node, fn ) {
	const children = node.children;
	children.forEach( child => {
		if ( !Array.isArray( child.children ) ) {
			return fn( child );
		}

		walk( child, fn );
	} );
}
