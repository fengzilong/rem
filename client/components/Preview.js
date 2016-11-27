import { ipcRenderer, clipboard } from 'electron';
import Notification from './Notification';
import walk from '../utils/walkPSDLayers';
import unique from '../utils/unique';
import Color from 'color';
import './Preview.less';

export default {
	components: {
		Notification,
	},
	template: `
		<div class="preview">
			{#if parsing}
			<div class="preview-loading">
				<div>Parsing <strong>[{ name }]</strong></div>
				<div>wait a moment...(*´∇｀*)</div>
			</div>
			{#else}
			<div class="preview-image-wrapper">
				<img src="{ png || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }" alt="" />

				{#list layers as layer}
				<div
					class="preview-text-layer"
					style="top: { layer.top }px;left: { layer.left }px;width: { layer.width }px;height: { layer.height }px;"
				></div>
				{/list}

				{#if isAboveTextLayer}
				<div class="preview-hint" r-style="{ { top: hintTop + 'px', left: hintLeft + 'px' } }">
					{#inc hintContent}
				</div>
				{/if}
			</div>
			{/if}
		</div>
		{#if notifyText}
		<Notification text="{ notifyText }"></Notification>
		{/if}
	`,
	config() {
		this.data.parsing = true;
		this.data.notifyText = '我是提示文字';
	},
	init() {
		const self = this;
		const { name, path } = this.$router.param;

		this.data.parsing = true;
		this.data.name = name;
		this.data.path = path;
		this.$update();

		const listeners = {
			mousemove: [],
			click: [],
		};

		ipcRenderer.once( 'parse-psd-done-' + path, function( e, parsed ) {
			const { tree, png } = parsed;
			const TEXT_LAYERS = getTextLayers( tree )
				.filter( layer => layer.visible && layer.opacity !== 0 );

			// set contentWidth to real psd width
			ipcRenderer.send( 'resize', {
				width: tree.document.width,
				height: 600,
			} );
			ipcRenderer.send( 'focus' );

			self.data.parsing = false;
			self.data.png = png;
			self.data.layers = TEXT_LAYERS;
			self.$update();

			// remove listeners
			listeners.mousemove.forEach( listener => {
				document.removeEventListener( 'mousemove', listener, false );
			} );
			listeners.click.forEach( listener => {
				document.removeEventListener( 'click', listener, false );
			} );
			listeners.mousemove.length = 0;
			listeners.click.length = 0;

			// add listener
			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'click', onClick, false );
			listeners.mousemove.push( onMouseMove );
			listeners.click.push( onClick );

			function onMouseMove( e ) {
				const { pageX, pageY } = e;

				const filtered = TEXT_LAYERS.filter( layer => {
					return inRect( {
						x: pageX,
						y: pageY,
					}, {
						top: layer.top,
						right: layer.right,
						bottom: layer.bottom,
						left: layer.left,
					} )
				} );

				if ( filtered.length > 0 ) {
					self.data.hintLeft = pageX + 10;
					self.data.hintTop = pageY + 10;
					self.data.hintContent = genHintContent( filtered );
					self.data.isAboveTextLayer = true;
					self.copyContent = getCopyContent( filtered );
					self.$update();
				} else {
					self.copyContent = '';
					self.$update( {
						isAboveTextLayer: false,
					} );
				}
			}

			function onClick( e ) {
				console.log( self.copyContent );
				clipboard.writeText( self.copyContent );
			}
		} );
		ipcRenderer.send( 'parse-psd', {
			filename: name,
			filepath: path,
		} );

		this.$on( '$destroy', () => {
			// remove listeners
			listeners.mousemove.forEach( listener => {
				document.removeEventListener( 'mousemove', listener, false );
			} );
			listeners.click.forEach( listener => {
				document.removeEventListener( 'click', listener, false );
			} );
			listeners.mousemove.length = 0;
			listeners.click.length = 0;
		} );
	},
};

function getTextLayers( tree ) {
	const layers = [];
	walk( tree, layer => {
		if ( layer.text && typeof layer.text.value !== 'undefined' ) {
			layers.push( layer );
		}
	} );
	return layers;
}

function inRect( { x, y }, { top, right, bottom, left } ) {
	return x >= left && x <= right &&
		y > top && y < bottom
}

function genHintContent( filtered ) {
	const colorConverter = Color();

	return filtered.map( v => {
		const colors = unique(
			v.text.font.colors.map( rgba => {
				const c = colorConverter.rgb( rgba );
				if ( rgba[ 3 ] === 255 ) {
					return c.hexString();
				} else {
					return c.rgbString();
				}
			} )
		);
		const sizes = unique( v.text.font.sizes );

		return `
			<div class="preview-hint-item">
				<div class="preview-hint-item-label">content</div>
				<div>
					<strong>${ v.text.value }</strong>
				</div>
			</div>
			<div class="preview-hint-item">
				<div class="preview-hint-item-label">fontSize</div>
				<div>
					<strong>${ sizes.join( '、' ) }</strong>
				</div>
			</div>
			<div class="preview-hint-item">
				<div class="preview-hint-item-label">color</div>
				<div>
					<strong>${ colors.join( '、' ) }</strong>
				</div>
			</div>
		`;
	} ).join( '<br />-----<br />' );
}

function getCopyContent( filtered ) {
	const colorConverter = Color();

	return filtered.map( v => {
		const colors = unique(
			v.text.font.colors.map( rgba => {
				const c = colorConverter.rgb( rgba );
				if ( rgba[ 3 ] === 255 ) {
					return c.hexString();
				} else {
					return c.rgbString();
				}
			} )
		);
		const sizes = unique( v.text.font.sizes );

		return `${ sizes.map( v => 'font-size: ' + v + 'px;' ).join( '\n' ) }\n${ colors.map( v => 'color: ' + v + ';' ).join( '\n' ) }`;
	} ).join( '\n\n' );
}
