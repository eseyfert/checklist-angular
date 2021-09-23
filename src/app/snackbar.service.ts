import { Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { SnackbarComponent } from './snackbar/snackbar.component';

/**
 * SnackbarService
 *
 * Handles the creation of the Snackbar component and passing messages to it.
 *
 * @export
 * @class SnackbarService
 * @version 1.0.0
 */
@Injectable({
	providedIn: 'root',
})
export class SnackbarService {
	private snackbarRef!: ComponentRef<SnackbarComponent>; // Snackbar component reference.

	constructor(private resolver: ComponentFactoryResolver) {}

	/**
	 * insert
	 *
	 * Insert Snackbar component into given container.
	 *
	 * @param {ViewContainerRef} entry Container to insert component into
	 * @memberof SnackbarService
	 * @since 1.0.0
	 */
	insert(entry: ViewContainerRef): void {
		// Get factory object for the given component.
		const factory = this.resolver.resolveComponentFactory(SnackbarComponent);

		// Insert Snackbar component and store its reference.
		this.snackbarRef = entry.createComponent(factory);
	}

	/**
	 * message
	 *
	 * Pass the given message to the Snackbar component.
	 *
	 * @param {string} message The message to display
	 * @memberof SnackbarService
	 * @since 1.0.0
	 */
	message(message: string): void {
		this.snackbarRef.instance.showSnackbar(message);
	}
}
