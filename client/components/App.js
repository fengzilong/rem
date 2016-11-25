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
	}
};
