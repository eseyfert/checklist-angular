import {
    Component,
    OnInit,
    AfterViewInit,
    ApplicationRef,
} from '@angular/core';
import { SlideComponent } from '../slide/slide.component';
import { PreferencesService } from '../preferences.service';
import { removeClassByPrefix } from '../helpers';

/**
 * PreferencesComponent
 *
 * Allows the user to change preferences for the app's accent color, background gradient and theme settings.
 *
 * @export
 * @class PreferencesComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @version 1.0.0
 */
@Component({
    selector: 'app-preferences',
    templateUrl: './preferences.component.html',
    styleUrls: ['./preferences.component.scss'],
    host: { class: 'mdf-slide' },
})
export class PreferencesComponent implements OnInit, AfterViewInit {
    accent: string; // Store the current accent.
    accents: string[] = []; // Array that will hold all available accent colors.
    accentSwatches!: NodeListOf<HTMLElement>; // Color swatches for our accent colors.
    appContainer!: any; // App container element.
    gradient: string; // Store the current gradient.
    gradients: string[] = []; // Array that will hold all available gradients.
    gradientSwatches!: NodeListOf<HTMLElement>; // Color swatches for our gradients.
    theme: string; // Store the current theme.

    constructor(
        private appRef: ApplicationRef,
        private preferences: PreferencesService,
        private slide: SlideComponent
    ) {
        // Get the app container element.
        this.appContainer =
            this.appRef.components[0].location.nativeElement.querySelector(
                '.mdf-app'
            );

        // Get current values for the user app preferences.
        this.accent = this.preferences.get('accent')!;
        this.gradient = this.preferences.get('gradient')!;
        this.theme = this.preferences.get('theme')!;
    }

    ngOnInit(): void {
        // Add all available accents.
        this.accents = [
            'red',
            'purple',
            'pink',
            'blue',
            'teal',
            'green',
            'yellow',
            'orange',
            'deep-orange',
        ];

        // Add all available gradients.
        this.gradients = [
            'JShine',
            'MegaTron',
            'Yoda',
            'Amin',
            'WitchingHour',
            'Flare',
            'KyooPal',
            'KyeMeh',
            'ByDesign',
            'BurningOrange',
            'Wiretap',
            'SummerDog',
            'SinCityRed',
            'BlueRaspberry',
            'eXpresso',
            'Quepal',
        ];
    }

    ngAfterViewInit(): void {
        // Get all available accent color and gradient swatches.
        this.accentSwatches = document.querySelectorAll('#accents .mdf-color');
        this.gradientSwatches = document.querySelectorAll(
            '#gradients .mdf-color'
        );
    }

    /**
     * changeAccent
     *
     * Change the current accent based on the clicked accent swatch.
     *
     * @param {Event} $event
     * @param {string} accent The new accent color
     * @memberof PreferencesComponent
     * @since 1.0.0
     */
    changeAccent($event: Event, accent: string): void {
        // Update the accent color in storage.
        this.preferences.set('accent', accent);

        // Remove the old accent class.
        removeClassByPrefix(document.body, 'mdf-accent-');

        // Add the new accent class.
        document.body.classList.add(`mdf-accent-${accent}`);

        // Set all color swatches as not active.
        for (const swatch of this.accentSwatches) {
            swatch.classList.remove('mdf-color--active');
        }

        // Set clicked color swatch as active.
        ($event.target as HTMLElement).classList.add('mdf-color--active');
    }

    /**
     * changeGradient
     *
     * Change the current gradient based on the clicked gradient swatch.
     *
     * @param {Event} $event
     * @param {string} gradient The new gradient
     * @memberof PreferencesComponent
     * @since 1.0.0
     */
    changeGradient($event: Event, gradient: string): void {
        // Update the gradient in storage.
        this.preferences.set('gradient', gradient);

        // Remove the old gradient class.
        removeClassByPrefix(this.appContainer, 'mdf-gradient-');

        // Add the new gradient class.
        this.appContainer.classList.add(`mdf-gradient-${gradient}`);

        // Set all color swatches as not active.
        for (const swatch of this.gradientSwatches) {
            swatch.classList.remove('mdf-color--active');
        }

        // Set clicked color swatch as active.
        ($event.target as HTMLElement).classList.add('mdf-color--active');
    }

    /**
     * toggleDarkTheme
     *
     * Toggle the app's dark theme mode.
     *
     * @memberof PreferencesComponent
     * @since 1.0.0
     */
    toggleDarkTheme(): void {
        // Get the current theme.
        const theme = this.preferences.get('theme');

        if (theme === 'light') {
            // Light theme is active, change to dark mode.
            this.preferences.set('theme', 'dark');
            document.body.classList.add('mdf-theme-dark');
        } else if (theme === 'dark') {
            // Dark theme is active, change back to light mode.
            this.preferences.set('theme', 'light');
            document.body.classList.remove('mdf-theme-dark');
        }
    }

    /**
     * goBack
     *
     * Go back to the Landing slide.
     *
     * @memberof PreferencesComponent
     * @since 1.0.0
     */
    goBack(): void {
        this.slide.moveSlidesTo('right');
    }
}
