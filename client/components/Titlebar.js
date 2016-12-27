import { ipcRenderer } from 'electron';
import './Titlebar.less';
import moveIcon from '../resources/move.png';
import closeIcon from '../resources/close.png';

export default {
	template: `
		<div class="titlebar">
			<div class="titlebar-drag" ref="drag"></div>
			<div class="titlebar-ops">
				<div class="titlebar-ops-item titlebar-ops-close" on-click="{ this.onClose() }">
					<img style="width: 15px;" src="{ closeIcon }" alt="x" />
				</div>
			</div>
			<div class="titlebar-title">{ title }</div>
		</div>
	`,
	config() {
		this.data.moveIcon = moveIcon;
		this.data.closeIcon = closeIcon;
	},
	onClose() {
		ipcRenderer.send( 'hide' );
		setTimeout( () => {
			ipcRenderer.send( 'resize', {
				width: 400,
				height: 260,
			} );
			this.$router.nav( 'drop' );
		}, 500 );
	},
};
