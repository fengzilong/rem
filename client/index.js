import reo from 'reo';
import App from './components/App';
import DropZone from './components/DropZone';
import Preview from './components/Preview';
import getters from './getters';
import actions from './actions';
import psd from './models/psd';
import preview from './models/preview';

import './css/index.less';

const app = reo();

app.model( psd );
app.model( preview );
app.getters( getters );
app.actions( actions );
app.router( { routes: [
	{ url: '/', component: App, children: [
		{ url: '/drop', component: DropZone },
		{ url: '/preview', component: Preview },
	] },
] } );

app.start( '#app' );

if ( !location.hash ) {
	location.href = '#!/drop'
}
