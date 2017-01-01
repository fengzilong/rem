import { ipcRenderer } from 'electron';
import Titlebar from './Titlebar';

export default {
	components: {
		Titlebar,
	},
	template: `
		<div class="app">
			{#if showTitle}
			<Titlebar title="{ title }"></Titlebar>
			{/if}
			<router-view></router-view>
		</div>
	`,
	config() {
		this.$router.on( 'end', () => {
			if ( this.$router.current.url === '/preview' ) {
				this.data.showTitle = true;
				this.data.title = this.$router.param.name;
			} else {
				this.data.showTitle = false;
			}
			this.$update();
		} );
		ipcRenderer.on( 'go-drop', () => {
			this.$router.nav( 'drop' );
		} );
		ipcRenderer.on( 'go-preview', ( e, { name, path } ) => {
			this.$router.nav( `preview?name=${ name }&path=${ path }` );
		} );
	}
};
