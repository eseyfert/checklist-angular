import { Component, OnInit } from '@angular/core';
import { SELECTOR } from './slide.constants';

/**
 * SlideComponent
 *
 * Handles Slides behavior.
 *
 * @export
 * @class SlideComponent
 * @implements {OnInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-slide',
	template: '',
	styleUrls: ['./slide.component.scss'],
	host: { class: 'mdf-slide' },
})
export class SlideComponent implements OnInit {
	private container: HTMLElement | null = null; // Slides container element.
	private slides: HTMLElement[] = []; // Array of available slides.
	private slideWidth: number = 0; // Width of slide element.
	private styles: CSSStyleDeclaration | null = null; // CSS styles for width calculations.
	private isInit: boolean = false; // Whether the slides were already initialized.

	constructor() {}

	ngOnInit(): void {
		// Get the slides container.
		this.container = document.querySelector(SELECTOR.container);

		// Get all available slides.
		this.slides = Array.from(document.querySelectorAll(SELECTOR.slide));
	}

	/**
	 * initSlide
	 *
	 * Initialize necessary variables and calculate widths for the first time.
	 *
	 * @memberof SlideComponent
	 * @since 1.0.0
	 */
	initSlide(): void {
		// Get the slides container.
		this.container = document.querySelector(SELECTOR.container);

		// Get all available slides.
		this.slides = Array.from(document.querySelectorAll(SELECTOR.slide));

		// If its the first time, calculate the widths.
		if (!this.isInit) {
			this.calcWidth();
			this.isInit = true;
		}
	}

	/**
	 * calcWidth
	 *
	 * Calculate width of the slide elements.
	 *
	 * @memberof SlideComponent
	 * @since 1.0.0
	 */
	calcWidth(): void {
		// Calculate the styles for a slide.
		this.styles = window.getComputedStyle(this.slides[0]);

		// Calculate the final width we will move each slide by.
		this.slideWidth = parseFloat(this.styles.width) + parseFloat(this.styles.marginRight);

		// Adjust the translateX value if the we are on a secondary slide.
		if (this.container?.style.transform.includes('-')) {
			this.container.style.transform = `translateX(-${this.slideWidth}px)`;
		}
	}

	/**
	 * moveSlidesTo
	 *
	 * Move the slides to the given direction.
	 *
	 * @param {string} direction Direction to move the slide in. Either `left` or `right`
	 * @memberof SlideComponent
	 * @since 1.0.0
	 */
	moveSlidesTo(direction: string): void {
		if (direction === 'left') {
			this.container!.style.transform = `translateX(-${this.slideWidth}px)`;
		} else if (direction === 'right') {
			this.container!.style.transform = `translateX(0px)`;
		}
	}
}
