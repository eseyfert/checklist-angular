import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { getScrollbarParent } from '../helpers';
import { CLASS, SELECTOR } from './dialog.constants';

/**
 * DialogComponent
 *
 * Used to dynamically create Dialog windows.
 * Allows for manipulation of the Dialog title, message, cancel and confirm events.
 *
 * @export
 * @class DialogComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit, AfterViewInit {
	@Input() title: string = ''; // Dialog title.
	@Input() message: string = ''; // Dialog message.
	@Input() keyboard: boolean = false; // Whether the Dialog was activated using a keyboard.
	@Output() cancelEvent = new EventEmitter(); // Dialog cancel event.
	@Output() confirmEvent = new EventEmitter(); // Dialog confirm event.

	container!: HTMLElement; // Dialog container element.
	firstFocusableElement!: HTMLElement; // First focusable element inside dialog.
	focusIndex: number = 0; // Index of the currently focused element.
	focusableElements!: HTMLElement[]; // List of focusable elements inside dialog.
	lastActiveElement!: HTMLElement; // Last active element before dialog was called.
	lastFocusableElement!: HTMLElement; // Last focusable element inside dialog.
	scrollbarParent!: HTMLElement; // First parent element that has overflowing content.

	constructor(private elRef: ElementRef) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		// We move the app element to the bottom of the document body so the Dialog displays properly.
		document.body.append(this.elRef.nativeElement);

		// Get the actual Dialog container element, not the component container.
		this.container = (this.elRef.nativeElement as HTMLElement).querySelector(SELECTOR.container) as HTMLElement;

		if (this.container) {
			// Store the last active (focused) element before the Dialog was called.
			this.lastActiveElement = document.activeElement as HTMLElement;

			// Look for the first parent element that has overflowing content.
			this.scrollbarParent = getScrollbarParent(this.container, SELECTOR.container);

			// Create a list of all focusable elements INSIDE the Dialog.
			this.focusableElements = Array.from(this.container.querySelectorAll(SELECTOR.focus));

			if (this.focusableElements.length) {
				// We store the first and last element that can receive focus.
				this.firstFocusableElement = this.focusableElements[0];
				this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
			}

			// Open the Dialog window.
			this.open();
		}
	}

	/**
	 * open
	 *
	 * Fade-in the Dialog window.
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	open(): void {
		// Activate the container to ready it for the transition.
		this.container.classList.add(CLASS.active);

		// After a short timeout, fade-in the container.
		setTimeout(() => this.container.classList.add(CLASS.fadeIn), 60);

		// Temporarily disable scrolling for the scrollbar parent.
		this.scrollbarParent.classList.add(CLASS.disableScrollbar);

		// Set focus to the first focusable element in the Dialog.
		if (this.keyboard && this.firstFocusableElement) {
			this.firstFocusableElement.focus();
		}
	}

	/**
	 * close
	 *
	 * Execute the given callback and fade-out the Dialog window.
	 *
	 * @param {() => void} closeAction The callback to execute
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	close(closeAction: () => void): void {
		// Fade-out the container.
		this.container.classList.remove(CLASS.fadeIn);

		// Wait for the fade-out transition to finish.
		const afterFadeOut = () => {
			// Remove the active class.
			this.container.classList.remove(CLASS.active);

			// Enable scrolling again for the scrollbar parent.
			this.scrollbarParent.classList.remove(CLASS.disableScrollbar);

			// Move focus to the last active element.
			if (this.keyboard) {
				this.lastActiveElement.focus();
			}

			// Remove the event listener to avoid repeats.
			this.container.removeEventListener('transitionend', afterFadeOut);

			// Execute the given callback.
			closeAction();
		};

		this.container.addEventListener('transitionend', afterFadeOut);
	}

	/**
	 * confirm
	 *
	 * Close the Dialog and emit the `confirm` event for the Dialog service.
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	confirm(): void {
		this.close(() => this.confirmEvent.emit());
	}

	/**
	 * cancel
	 *
	 * Close the Dialog and emit the `cancel` event for the Dialog service.
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	cancel(): void {
		this.close(() => this.cancelEvent.emit());
	}

	/**
	 * setFocusOnElem
	 *
	 * Set focus on element with the given index.
	 *
	 * @param {number} index Index of the element
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	setFocusOnElem(index: number): void {
		this.focusableElements[index].focus();
	}

	/**
	 * focusPreviousElem
	 *
	 * Move focus to the previous focusable element.
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	focusPreviousElem(): void {
		if (this.focusIndex >= 1) {
			// Move to the previous element.
			this.focusIndex--;
		} else if (this.focusIndex === 0) {
			// If we are on the first element, wrap back around to the last element.
			this.focusIndex = this.focusableElements.length - 1;
		}

		// We move the focus to the previous element.
		this.setFocusOnElem(this.focusIndex);
	}

	/**
	 * focusNextElem
	 *
	 * Move focus to the next focusable element.
	 *
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	focusNextElem(): void {
		if (this.focusIndex === this.focusableElements.length - 1) {
			// If we are on the last element, wrap back around to the first element.
			this.focusIndex = 0;
		} else if (this.focusIndex >= 0) {
			// Move to the next element.
			this.focusIndex++;
		}

		// We move the focus to the next element.
		this.setFocusOnElem(this.focusIndex);
	}

	/**
	 * keyEvents
	 *
	 * Listen for keyboard inputs.
	 * Traps focus inside the Dialog while it is active.
	 *
	 * @param {KeyboardEvent} $event
	 * @memberof DialogComponent
	 * @since 1.0.0
	 */
	@HostListener('document:keydown', ['$event'])
	keyEvents($event: KeyboardEvent) {
		if ($event.key === 'Tab' && $event.shiftKey) {
			// Tab backwards, focus the previous element.
			$event.preventDefault();
			this.focusPreviousElem();
		} else if ($event.key === 'Tab') {
			// Tab forwards, focus the next element.
			$event.preventDefault();
			this.focusNextElem();
		} else if ($event.key === 'Escape') {
			// Escape cancels the Dialog.
			$event.preventDefault();
			this.cancel();
		}
	}
}
