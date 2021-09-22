const CLASS = {
	active: 'mdf-dialog-container--active',
	disableScrollbar: 'mdf-scrollbar-hidden',
	fadeIn: 'mdf-dialog-container--fade-in',
	transition: 'mdf-dialog--transition',
};

const SELECTOR = {
	container: '.mdf-dialog-container',
	content: '.mdf-dialog__content',
	focus: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe:not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])',
	text: '.mdf-dialog__content p',
	title: '.mdf-dialog__title',
};

export { CLASS, SELECTOR };
