import { ipcRenderer, clipboard } from 'electron';
import Notification from './Notification';
import walk from '../utils/walkPSDLayers';
import unique from '../utils/unique';
import color from 'color';
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
					on-mousemove="{ this.onMouseMove( $event, layers ) }"
					on-mouseleave="{ this.onMouseLeave() }"
				></div>
				{/list}

				{#if isAboveTextLayer}
				<div
					class="preview-hint"
					r-style="{ { top: hintTop, left: hintLeft, right: hintRight, bottom: hintBottom } }"
				>
					{#inc hintContent}
				</div>
				{/if}
			</div>

			{/if}
		</div>
		{#if showNotification}
		<Notification text="{ notifyText }"></Notification>
		{/if}
	`,
	config() {
		this.data.parsing = true;
		this.data.showNotification = false;
		this.data.notifyText = '';
	},
	init() {
		const self = this;
		const { name, path } = this.$router.param;

		this.data.parsing = true;
		this.data.name = name;
		this.data.path = path;
		this.$update();

		const listeners = {
			click: [],
		};

		ipcRenderer.once( 'parse-psd-done-' + path, function ( e, parsed ) {
			const { tree, png } = parsed;
			const TEXT_LAYERS = getTextLayers( tree )
				.filter( layer => layer.visible && layer.opacity !== 0 );

			self.data.parsing = false;
			self.$update();

			// set contentWidth to real psd width
			ipcRenderer.send( 'resize', {
				width: tree.document.width,
				height: 600,
			} );
			ipcRenderer.send( 'focus' );

			self.data.png = png;
			self.data.layers = TEXT_LAYERS;
			self.$update();

			// remove listeners
			listeners.click.forEach( listener => {
				document.removeEventListener( 'click', listener, false );
			} );
			listeners.click.length = 0;

			// add listener
			document.addEventListener( 'click', onCopy, false );
			listeners.click.push( onCopy );

			let timer;
			function onCopy() {
				if ( !self.copyContent ) {
					return;
				}

				clipboard.writeText( self.copyContent );

				if ( self.data.showNotification ) {
					clearTimeout( timer );
					self.data.showNotification = false;
					self.data.notifyText = '';
					self.$update();

					return setTimeout( onCopy, 100 );
				}

				self.data.showNotification = true;
				self.data.notifyText = '已复制';
				self.$update();

				timer = setTimeout( () => {
					self.data.showNotification = false;
					self.data.notifyText = '';
					self.$update();
				}, 1700 );
			}
		} );

		ipcRenderer.send( 'parse-psd', {
			filename: name,
			filepath: path,
		} );

		this.$on( '$destroy', () => {
			// remove listeners
			listeners.click.forEach( listener => {
				document.removeEventListener( 'click', listener, false );
			} );
			listeners.click.length = 0;
		} );
	},
	onMouseMove( e, layers ) {
		const { pageX, pageY } = e;

		const filtered = layers.filter( layer => {
			return inRect( {
				x: pageX,
				y: pageY,
			}, {
				top: layer.top,
				right: layer.right,
				bottom: layer.bottom,
				left: layer.left,
			} );
		} );

		if ( filtered.length > 0 ) {
			const { top, right, bottom, left } = getSuitablePosition( {
				pageX, pageY
			} );
			this.data.hintTop = top;
			this.data.hintRight = right;
			this.data.hintBottom = bottom;
			this.data.hintLeft = left;
			this.data.hintContent = genHintContent( filtered );
			this.data.isAboveTextLayer = true;
			this.copyContent = getCopyContent( filtered );
			this.$update();
		} else {
			this.copyContent = '';
			this.$update( {
				isAboveTextLayer: false,
			} );
		}
	},
	onMouseLeave() {
		this.data.isAboveTextLayer = false;
		this.$update();
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
		y > top && y < bottom;
}

function genHintContent( filtered ) {
	const colorConverter = color();

	return filtered.map( v => {
		const colors = unique(
			v.text.font.colors.map( rgba => {
				const c = colorConverter.rgb( rgba );
				if ( rgba[ 3 ] === 255 ) {
					return c.hexString();
				}

				return c.rgbString();
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
	const colorConverter = color();

	return filtered.map( v => {
		const colors = unique(
			v.text.font.colors.map( rgba => {
				const c = colorConverter.rgb( rgba );
				if ( rgba[ 3 ] === 255 ) {
					return c.hexString();
				}

				return c.rgbString();
			} )
		);
		const sizes = unique( v.text.font.sizes );

		return `${ sizes.map( v => 'font-size: ' + v + 'px;' ).join( '\n' ) }\n${ colors.map( v => 'color: ' + v + ';' ).join( '\n' ) }`;
	} ).join( '\n\n' );
}

function getSuitablePosition( { pageX, pageY } ) {
	const HINT_THRESHOLD_X = 150;
	const HINT_THRESHOLD_Y = 50;

	const scrollY = window.scrollY;
	const width = window.innerWidth;
	const height = window.innerHeight;

	const position = {
		top: pageY + 15 + 'px',
		right: 'initial',
		bottom: 'initial',
		left: pageX + 15 + 'px',
	};

	if ( pageX < HINT_THRESHOLD_X ) {
		// 太靠左
		position.left = pageX + 15 + 'px';
		position.right = 'initial';
	} else if ( width - pageX < HINT_THRESHOLD_X ) {
		// 太靠右
		position.right = width - pageX - 15 + 'px';
		position.left = 'initial';
	}

	if ( pageY - scrollY < HINT_THRESHOLD_Y ) {
		// 太靠上
		position.top = pageY + 15 + 'px';
		position.bottom = 'initial';
	} else if ( height - ( pageY - scrollY ) < HINT_THRESHOLD_Y ) {
		// 太靠下
		position.bottom = height - ( pageY - scrollY ) + 'px';
		position.top = 'initial';
	}

	return position;
}
