import App from './components/App';
import DropZone from './components/DropZone';
import Preview from './components/Preview';

export default {
	routes: [
		{
			path: '/',
			component: App,
			children: [
				{ path: '/drop', component: DropZone },
				{ path: '/preview', component: Preview },
			]
		},
	]
};
