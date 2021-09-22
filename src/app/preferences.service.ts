import { Injectable } from '@angular/core';

/**
 * PreferencesService
 *
 * Handles the getting and setting of App user preferences in localStorage.
 *
 * @export
 * @class PreferencesService
 * @version 1.0.0
 */
@Injectable({
	providedIn: 'root',
})
export class PreferencesService {
	accent: string; // The current accent color.
	gradient: string; // The current background gradient.
	theme: string; // The current app theme.

	constructor() {
		// Store current user preferences.
		this.accent = this.get('accent')!;
		this.gradient = this.get('gradient')!;
		this.theme = this.get('theme')!;

		// If no user preferences exist yet, save default values.
		this.setDefaults();
	}

	/**
	 * get
	 *
	 * Get given setting from localStorage.
	 *
	 * @param {string} setting Setting to look up (accent, gradient or theme)
	 * @return {*}  {(string | null)}
	 * @memberof PreferencesService
	 * @since 1.0.0
	 */
	get(setting: string): string | null {
		return localStorage.getItem(`app-${setting}`);
	}

	/**
	 * set
	 *
	 * Save given setting to localStorage.
	 *
	 * @param {string} setting Setting to save (accent, gradient or theme)
	 * @memberof PreferencesService
	 * @since 1.0.0
	 */
	set(setting: string, value: string): void {
		localStorage.setItem(`app-${setting}`, value);
	}

	/**
	 * setDefaults
	 *
	 * Save default preferences settings to localStorage.
	 *
	 * @memberof PreferencesService
	 * @since 1.0.0
	 */
	setDefaults(): void {
		if (!this.accent) {
			this.set('accent', 'green');
		}

		if (!this.gradient) {
			this.set('gradient', 'Quepal');
		}

		if (!this.theme) {
			this.set('theme', 'light');
		}
	}
}
