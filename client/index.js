import reo from 'reo';
import App from './components/App';
import DropZone from './components/DropZone';
import Preview from './components/Preview';
import './css/index.less';

const app = reo();

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
