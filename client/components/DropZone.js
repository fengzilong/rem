import { ipcRenderer } from 'electron';
import './DropZone.less';

export default {
	components: {
	},
	template: `
		<div class="dropzone" ref="v">
			<div>Please Drop Your PSD here!</div>
		</div>
	`,
	init() {
		const self = this;
		const $dropzone = this.$refs.v;
		const triggers = 'drag dragstart dragend dragover dragenter dragleave drop'.split( ' ' );

		triggers.forEach( trigger => {
			$dropzone.addEventListener( trigger, onPrevent, false )
		} );
		$dropzone.addEventListener( 'drop', onDrop, false );

		this.$on( '$destroy', () => {
			triggers.forEach( trigger => {
				$dropzone.removeEventListener( trigger, onPrevent, false )
			} );
			$dropzone.removeEventListener( 'drop', onDrop, false );
		} );

		function onPrevent( e ) {
			e.preventDefault();
			e.stopPropagation();
		}

		function onDrop( e ) {
			const file = e.dataTransfer.files[ 0 ];
			if ( !file ) {
				return;
			}

			const { name, path } = file;

			ipcRenderer.send( 'save-as-recent-file', { name, path } );

			self.$router.nav( `preview?name=${ name }&path=${ path }` );
		}

	}
};
