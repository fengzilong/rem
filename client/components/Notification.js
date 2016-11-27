import './Notification.less';

export default {
	template: `
		<div
			class="notification"
			r-animation="on:enter;class: notification-in,3;"
		>
			{ text }
		</div>
	`,
	config() {

	},
	init() {

	},
}
