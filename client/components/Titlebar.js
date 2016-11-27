import { ipcRenderer } from 'electron';
import './Titlebar.less';
import moveIcon from '../resources/move.png';
import minimizeIcon from '../resources/minimize.png';
import closeIcon from '../resources/close.png';

export default {
	template: `
		<div class="titlebar">
			<div class="titlebar-drag" ref="drag"></div>
			<div class="titlebar-ops">
				{!
				<div class="titlebar-ops-item titlebar-ops-move">
					<img style="width: 18px;" src="{ moveIcon }" alt="*" />
				</div>
				!}
				<div class="titlebar-ops-item titlebar-ops-minimize" on-click="{ this.onMinimize() }">
					<img style="width: 9px;" src="{ minimizeIcon }" alt="-" />
				</div>
				<div class="titlebar-ops-item titlebar-ops-close" on-click="{ this.onClose() }">
					<img style="width: 15px;" src="{ closeIcon }" alt="x" />
				</div>
			</div>
			<div class="titlebar-title">{ title }</div>
		</div>
	`,
	config() {
		this.data.moveIcon = moveIcon;
		this.data.minimizeIcon = minimizeIcon;
		this.data.closeIcon = closeIcon;
	},
	onMinimize() {
		ipcRenderer.send( 'hide' );
	},
	onClose() {
		ipcRenderer.send( 'resize', {
			width: 400,
			height: 260,
		} );
		ipcRenderer.send( 'center' );
		ipcRenderer.send( 'focus' );
		this.$router.nav( 'drop' );
	},
};
