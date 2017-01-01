import reo from 'reo';
import routes from './routes';

import './css/index.less';

const app = reo();

app.router( routes );
app.start( '#app' );

if ( !location.hash ) {
	location.href = '#!/drop';
}
