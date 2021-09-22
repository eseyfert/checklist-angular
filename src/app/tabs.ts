import '@miraidesigns/base';

const attr = {
	index: 'tabindex',
	selected: 'aria-selected',
};

const classes = {
	panel: 'mdf-tabs__panel',
	panelActive: 'mdf-tabs__panel--active',
	selectionActive: 'mdf-tabs__selection--active',
	stopTransitions: 'mdf-disable-transitions',
	tab: 'mdf-tabs__tab',
	tabSelected: 'mdf-tabs__tab--selected',
};

const selectors = {
	bar: '.mdf-tabs__bar',
	container: '.mdf-tabs',
	panel: '.mdf-tabs__panel',
	panelActive: '.mdf-tabs__panel--active',
	selection: '.mdf-tabs__selection',
	selectionBar: '.mdf-tabs__selection-bar',
	tab: '.mdf-tabs__tab',
	tabSelected: '.mdf-tabs__tab--selected',
};

/**
 * MDFTabs
 *
 * Tabs allow you to organize content into different panels or screens.
 *
 * @export
 * @class MDFTabs
 * @version 1.0.0
 */
export class MDFTabs {
	private bar!: HTMLElement;
	private container: HTMLElement;
	private panels: HTMLElement[] = [];
	private tabs!: HTMLElement[];
	private tabsRect: DOMRect[] = [];

	/**
	 * Creates an instance of MDFTabs.
	 *
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	constructor() {
		// Store a reference to the given element.
		this.container = document.querySelector(selectors.container) as HTMLElement;

		// Abort script if container is not found.
		if (!this.container) return;

		// Get the tabs bar element.
		this.bar = this.container.querySelector(selectors.bar)!;

		// Get a list of all tab elements.
		this.tabs = Array.from(this.bar.querySelectorAll(selectors.tab));

		// Don't continue if we have no tab elements.
		if (!this.tabs) return;

		// Get a list of all panel elements.
		this.panels = Array.from(this.container.querySelectorAll(selectors.panel));

		// Don't continue if we have no panel elements.
		if (!this.panels) return;

		// Create an array holding box dimension of all tabs.
		this.updateClientRects();

		// Add event listeners.
		this.addEvents();
	}

	/**
	 * updateClientRects
	 *
	 * Update the box dimensions of all tabs.
	 *
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private updateClientRects = (): void => {
		this.tabsRect = [];
		for (const tab of this.tabs) {
			this.tabsRect.push(tab.getBoundingClientRect());
		}
	};

	/**
	 * focusTab
	 *
	 * Set focus to this tab and update its tabindex.
	 *
	 * @param {HTMLElement} tab The tab element
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private focusTab = (tab: HTMLElement) => {
		// Remove the `tabindex` attribute from the focused element.
		tab.removeAttribute(attr.index);

		// Set the tab as selected.
		tab.setAttribute(attr.selected, 'true');

		// Give the tab focus.
		tab.focus();
	};

	/**
	 * blurTab
	 *
	 * Remove focus from this tab and update its tabindex.
	 *
	 * @param {HTMLElement} tab The tab element
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private blurTab = (tab: HTMLElement) => {
		// We remove the non-active tabs from the tab order.
		tab.tabIndex = -1;

		// Set the tab as unselected.
		tab.removeAttribute(attr.selected);

		// Remove focus from the tab.
		tab.blur();
	};

	/**
	 * switchTab
	 *
	 * Switch tabs animating the selection bar moving from the current tab to the selected one.
	 *
	 * @param {number} currTab Current tab we will switch from
	 * @param {number} targetTab Target tab we will switch to
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private switchTab = (currTab: HTMLElement, targetTab: HTMLElement) => {
		// Setup variables to keep track of the current tab elements.
		const currIndex = this.tabs.indexOf(currTab);
		const currRect = this.tabsRect[currIndex];
		const currPanel = this.panels[currIndex];

		// Setup variables to keep track of the tab elements we are switching to.
		const newIndex = this.tabs.indexOf(targetTab);
		const newRect = this.tabsRect[newIndex];
		const newSelection: HTMLElement = targetTab.querySelector(selectors.selection)!;
		const newPanel = this.panels[newIndex];

		// Calculate the difference in width and positioning between old and new tabs.
		const widthDelta = currRect.width / newRect.width;
		const leftDelta = currRect.left - newRect.left;

		// Disable all transitions while we adjust the selection's model.
		newSelection.classList.add(classes.stopTransitions);

		// Setup the position the selection is moving from.
		newSelection.style.transform = `translateX(${leftDelta}px) scaleX(${widthDelta})`;

		// Force repaint, otherwise the transform will not work properly.
		newSelection.getBoundingClientRect();

		// Enable transitions again.
		newSelection.classList.remove(classes.stopTransitions);

		// Take focus away from the last tab.
		currTab.classList.remove(classes.tabSelected);
		this.blurTab(currTab);

		// Put focus on the target tab.
		targetTab.classList.add(classes.tabSelected);
		this.focusTab(targetTab);

		// Move the selection into place.
		newSelection.style.transform = '';

		// Hide the current panel.
		if (currPanel) {
			currPanel.classList.remove(classes.panelActive);
		}

		// Show the new panel.
		if (newPanel) {
			newPanel.classList.add(classes.panelActive);
		}
	};

	/**
	 * mouseEvents
	 *
	 * Add mouse navigation.
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private mouseEvents = (evt: MouseEvent) => {
		// The clicked element.
		const _this = evt.target as HTMLElement;

		// Make sure it is a tab element.
		if (_this.matches(selectors.tab)) {
			// Stop the event from bubbling up. For tabs within tabs, mainly used for the framework preview.
			evt.stopPropagation();

			// Prevent default mouse behavior just in case.
			evt.preventDefault();

			// Get the currently active tab.
			const activeTab: HTMLElement = this.container.querySelector(selectors.tabSelected)!;

			// Switch the selected tab.
			this.switchTab(activeTab, _this);
		}
	};

	/**
	 * keyboardEvents
	 *
	 * Add ARIA compliant keyboard navigation.
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private keyboardEvents = (evt: KeyboardEvent) => {
		// The activated element.
		const _this = evt.target as HTMLElement;

		// Make sure we are on a tab element.
		if (_this.matches(selectors.tab)) {
			// Stop the event from bubbling up. For tabs within tabs, mainly used for the framework preview.
			evt.stopPropagation();

			// Setup variable for the target tab element.
			let targetTab: HTMLElement;

			// We use the left and right arrow keys to navigate the tab elements.
			if (evt.key === 'ArrowLeft') {
				if (_this.previousElementSibling === null) {
					// If we are on the first tab element, we will wrap around to the last one.
					targetTab = this.bar.lastElementChild as HTMLElement;
				} else {
					// Target the previous tab element.
					targetTab = _this.previousElementSibling as HTMLElement;
				}

				// Initiate the switch.
				this.switchTab(_this, targetTab);
			} else if (evt.key === 'ArrowRight') {
				if (_this.nextElementSibling === null) {
					// If we are on the last tab element, we will wrap around to the first one.
					targetTab = this.bar.firstElementChild as HTMLElement;
				} else {
					// Target the next tab element.
					targetTab = _this.nextElementSibling as HTMLElement;
				}

				// Initiate the switch.
				this.switchTab(_this, targetTab);
			}
		}
	};

	/**
	 * addEvents
	 *
	 * Add the event listeners.
	 *
	 * @private
	 * @memberof MDFTabs
	 * @since 1.0.0
	 */
	private addEvents = () => {
		this.container.addEventListener('click', this.mouseEvents);
		this.container.addEventListener('keydown', this.keyboardEvents);
	};
}
