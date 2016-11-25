import './Titlebar.less';

export default {
	template: `
		<div class="titlebar">
			<div class="titlebar-drag" ref="drag"></div>
			<div class="titlebar-ops">
				<div class="titlebar-ops-item titlebar-ops-minimize">
					<img style="width: 9px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADYElEQVR4Xu2Z0Y3UQBBEuzOADCADMoAMgEiASDgi4ciAy4AMIASIYNBIe5+nHWt9fpbq7bfXVV31tu21u/xEJ9DR0zt8CUA4BAIgAOEJhI/vBhCA8ATCx3cDCEB4AuHjuwEEIDyB8PHdAAIQnkD4+G4AAQhPIHx8N4AAhCcQPr4bQADCEwgf3w0gAOEJhI/vBhCA8ATCx3cDCEB4AuHjuwEEIDyB8PHdAAIQnkD4+G4AAQhPIHx8N4AAhCcQPr4bQADCEwgf3w0gAOEJhI/vBhCA8ATCx3cDCEB4AuHjuwEEIDyB8PHdAAIQnkD4+G4AAQhPIHx8N4AAhCcQPr4bQADCEwgf3w0gAOEJhI/vBhCA8ATCx3cDCMC2BMYYr6rqU1W9q6o3277t0c+UwK+q+llV37r7zxaNTRtgjPG1qj5vEfDYwxO46+4vq6rLAIwxvlfVh9UTexyawH13f1xxsATAGOPusvZXzukx50hgXg6ubuurAFyu+b/PMZMuNibw+to9wQoA/vo3pn6iw69ugRUA5t3l2xMNpZX1BB66e/5be/KzAsBY1/PIkyXwt7tfCsDJWjnQzr/ufnErAF4CDmxsZ6ldLgHeBO7cyoGn2+UmcD769W/gga3tKHX738BpxgdBO1Zy3Kmu/vqnlav/Ah79jjHuq+r9cf5VuiGBH9299Nh+GQA3wQ11HPvVpV/+o6VNAFwgmPcE8xnzfBXsA6Jjy31K7aGq5ivh+Sbw+V4Hn2NWXeyZwOYNsKe45+ITEAC+A9SBAKDx8+ICwHeAOhAANH5eXAD4DlAHAoDGz4sLAN8B6kAA0Ph5cQHgO0AdCAAaPy8uAHwHqAMBQOPnxQWA7wB1IABo/Ly4APAdoA4EAI2fFxcAvgPUgQCg8fPiAsB3gDoQADR+XlwA+A5QBwKAxs+LCwDfAepAAND4eXEB4DtAHQgAGj8vLgB8B6gDAUDj58UFgO8AdSAAaPy8uADwHaAOBACNnxcXAL4D1IEAoPHz4gLAd4A6EAA0fl5cAPgOUAcCgMbPiwsA3wHqQADQ+HlxAeA7QB0IABo/Ly4AfAeoAwFA4+fFBYDvAHUgAGj8vLgA8B2gDgQAjZ8XFwC+A9SBAKDx8+ICwHeAOhAANH5eXAD4DlAHAoDGz4v/B94HVIF48P/sAAAAAElFTkSuQmCC" alt="-" />
				</div>
				<div class="titlebar-ops-item titlebar-ops-close">
					<img style="width: 15px;" src="data:image/png;base64,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" alt="x" />
				</div>
			</div>
			<div class="titlebar-title">{ title }</div>
		</div>
	`,
	init() {
		const $drag = this.$refs.drag;
		$drag.style[ '-webkit-app-region' ] = 'drag';
	}
};