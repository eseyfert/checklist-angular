import {
	Component,
	OnInit,
	AfterViewInit,
	Type,
	ElementRef,
	ViewChild,
	ViewContainerRef,
	ComponentFactoryResolver,
	ChangeDetectorRef,
	HostListener,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PreferencesService } from './preferences.service';
import { SnackbarService } from './snackbar.service';
import { SlideComponent } from './slide/slide.component';

/**
 * AppComponent
 *
 * A simple and elegant checklist app that helps you stay organized.
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild('snackbar', { read: ViewContainerRef })
	snackbar!: ViewContainerRef; // Contains our generated Snackbar component.
	@ViewChild('slide', { read: ViewContainerRef })
	slides!: ViewContainerRef; // Contains our generated Slide component.

	appContainer!: HTMLElement; // Container element of the App component.
	landing: boolean = true; // Used to determine if we need to refresh the Landing component.
	lastComponent!: Type<unknown> | null; // Store reference to the last created component.
	resize$: Subject<void> = new Subject<void>(); // Subject for resize event changes.

	constructor(
		private elemRef: ElementRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cdRef: ChangeDetectorRef,
		private preferences: PreferencesService,
		private snackbarService: SnackbarService,
		private slide: SlideComponent
	) {}

	ngOnInit(): void {
		// Listen for the window resize event and re-calculate slide dimensions.
		this.resize$.pipe(debounceTime(60)).subscribe(() => {
			this.slide.initSlide();
			this.slide.calcWidth();
		});
	}

	ngAfterViewInit(): void {
		// Get the app container element.
		this.appContainer = this.elemRef.nativeElement.querySelector('.mdf-app');

		// Apply the user preferences.
		this.applyPreferences();

		// Insert the Snackbar component we'll be using App-wide.
		this.snackbarService.insert(this.snackbar);

		// Detect changes to avoid errors.
		this.cdRef.detectChanges();
	}

	/**
	 * onResize
	 *
	 * Let our script know that the window size changed.
	 *
	 * @memberof AppComponent
	 * @since 1.0.0
	 */
	@HostListener('window:resize')
	onResize(): void {
		this.resize$.next();
	}

	/**
	 * applyPreferences
	 *
	 * Apply the required classes to match the user's preferences.
	 *
	 * @memberof AppComponent
	 * @since 1.0.0
	 */
	applyPreferences(): void {
		if (this.preferences.theme === 'dark') {
			document.body.classList.add('mdf-theme-dark');
		}

		if (this.preferences.accent) {
			document.body.classList.add(`mdf-accent-${this.preferences.accent}`);
		}

		if (this.preferences.gradient) {
			this.appContainer.classList.add(`mdf-gradient-${this.preferences.gradient}`);
		}
	}

	/**
	 * insertComponent
	 *
	 * Insert the given component in the `#slide` container.
	 *
	 * @param {Type<unknown>} component The component to insert
	 * @param {boolean} forceRemove Force the removal of the last inserted component
	 * @memberof AppComponent
	 * @since 1.0.0
	 */
	insertComponent<T>(component: Type<T>, forceRemove: boolean = false): void {
		// We only continue if a different component is requested OR the last component has to be removed.
		if (this.lastComponent !== component || forceRemove === true) {
			// Create factory object for the passed component.
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

			// Remove any left-over components.
			this.slides.clear();

			// Append the new component.
			this.slides.createComponent(componentFactory);

			// Store reference to the last component.
			this.lastComponent = component;
		}
	}

	/**
	 * removeComponents
	 *
	 * Remove all components in the Slides container.
	 *
	 * @memberof AppComponent
	 * @since 1.0.0
	 */
	removeComponents(): void {
		// Clear the Slides container.
		this.slides.clear();

		// Remove stored component reference.
		this.lastComponent = null;
	}

	/**
	 * refreshLanding
	 *
	 * Refreshes the Landing component.
	 *
	 * @memberof AppComponent
	 * @since 1.0.0
	 */
	refreshLanding(): void {
		this.landing = false;
		this.cdRef.detectChanges();
		this.landing = true;
	}
}
