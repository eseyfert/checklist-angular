import { Component, OnInit, AfterViewInit, Input, ElementRef, HostListener } from '@angular/core';
import { ATTR, CLASS, SELECTOR } from './snackbar.constants';

/**
 * SnackbarComponent
 *
 * Supply template and functions to display a snackbar message at the bottom of the screen.
 *
 * @export
 * @class SnackbarComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-snackbar',
	templateUrl: './snackbar.component.html',
	styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit, AfterViewInit {
	@Input() message: string = ''; // Text message to display.

	isActive: boolean = false; // Whether the snackbar is active.
	delay: number = 5000; // For how long the snackbar is visible (in ms).
	queue: string[] = []; // Messages queue.
	snackbar!: HTMLElement; // Snackbar element we are manipulating.
	textContainer!: HTMLElement; // Snackbar text container.
	timeout!: number; // Holds the timeout id.

	constructor(private elemRef: ElementRef) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		// Get the snackbar container and text message container element.
		this.snackbar = this.elemRef.nativeElement.querySelector(SELECTOR.container);
		this.textContainer = this.elemRef.nativeElement.querySelector(SELECTOR.text);
	}

	/**
	 * showSnackbar
	 *
	 * Display the snackbar, optionally with supplied message.
	 *
	 * @param {string} message The message to be displayed.
	 * @memberof SnackbarComponent
	 * @since 1.0.0
	 */
	showSnackbar(message: string): void {
		// If a snackbar is still active, add message to queue and don't continue.
		if (this.isActive) {
			if (message) {
				this.queue.push(message);
			}
			return;
		}

		// Clear the snackbar timeout id.
		clearTimeout(this.timeout);

		// Set the snackbar as `active`.
		this.isActive = true;

		// Set snackbar text message.
		this.message = message;

		// Announce message to assistive technologies.
		this.announceSnackbar();

		// Show the snackbar element.
		this.snackbar.classList.add(CLASS.active);

		// After a set delay, hide the snackbar element.
		this.timeout = window.setTimeout(() => this.hideSnackbar(), this.delay);
	}

	/**
	 * announceSnackbar
	 *
	 * Method to have screen readers announce the snackbar message.
	 *
	 * @memberof SnackbarComponent
	 * @since 1.0.0
	 */
	announceSnackbar(): void {
		// Don't continue if the snackbar is hidden.
		if (!this.isActive) return;

		// Set the `aria-live` attribute to `off` while we manipulate the element.
		this.snackbar.setAttribute(ATTR.live, 'off');

		// Cache the current snackbar message.
		const origMessage = this.message;

		/**
		 * Temporarily empty out the textContent to force the screen readers to detect a change.
		 * Based on: https://github.com/material-components/material-components-web/commit/b4b19b720417bea5f211be1e37821ffb7a5c0759
		 */
		this.textContainer.textContent = '';
		this.textContainer.innerHTML = '<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>';

		// Temporarily display the message through the `::before` pseudo element while we reset the textContent.
		this.textContainer.setAttribute(ATTR.message, origMessage);

		setTimeout(() => {
			// We change the `aria-live` attribute to `polite` so screen readers can announce the message.
			this.snackbar.setAttribute(ATTR.live, 'polite');

			// Remove the `::before` text.
			this.textContainer.removeAttribute(ATTR.message);

			// Restore the original snackbar message to have the screen reader announce it.
			this.message = origMessage;
			this.textContainer.textContent = this.message;
		}, 1000);
	}

	/**
	 * displayNextMessage
	 *
	 * Display next message in queue.
	 *
	 * @memberof SnackbarComponent
	 * @since 1.0.0
	 */
	displayNextMessage(): void {
		// Queue is empty, don't continue.
		if (!this.queue.length) return;

		// Display next message.
		this.showSnackbar(this.queue.shift()!);
	}

	/**
	 * hideSnackbar
	 *
	 * Hide the snackbar element.
	 *
	 * @memberof SnackbarComponent
	 * @since 1.0.0
	 */
	hideSnackbar(): void {
		// Hide the snackbar element.
		this.snackbar.classList.remove(CLASS.active);

		// Function will fire as soon as the snackbar element transition has ended.
		const waitForTransition = () => {
			// Clear the snackbar timeout id.
			clearTimeout(this.timeout);

			// Set 'active' status to 'false'.
			this.isActive = false;

			// Show next message.
			this.displayNextMessage();

			// Remove 'transitionend' event from snackbar element.
			this.snackbar.removeEventListener('transitionend', waitForTransition);
		};

		// Add 'transitionend' event to the snackbar element.
		this.snackbar.addEventListener('transitionend', waitForTransition);
	}

	/**
	 * keyboardEvents
	 *
	 * Handle keyboard inputs while the snackbar is active.
	 *
	 * @param {KeyboardEvent} $event
	 * @memberof SnackbarComponent
	 */
	@HostListener('document:keydown', ['$event'])
	keyboardEvents($event: KeyboardEvent): void {
		// Make sure the user pressed the `ESC` key.
		if ($event.key === 'Escape') {
			// Prevent default behavior.
			$event.preventDefault();

			// If the snackbar is currently visible, hide it.
			if (this.isActive && this.snackbar.classList.contains(CLASS.active)) {
				this.hideSnackbar();
			}
		}
	}
}
