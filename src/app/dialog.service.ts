import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';

/**
 * DialogService
 *
 * Handles the creation and destruction of Dialog components.
 *
 * @export
 * @class DialogService
 * @version 1.0.0
 */
@Injectable({ providedIn: 'root' })
export class DialogService {
	private componentRef!: ComponentRef<DialogComponent>; // Dialog component reference.
	private componentSubscriber!: Subject<string>; // Observable we will create for the Dialog.

	constructor(private resolver: ComponentFactoryResolver) {}

	/**
	 * open
	 *
	 * Insert the Dialog component in the given ViewContainer with the supplied attributes.
	 *
	 * @param {ViewContainerRef} entry Container to insert the Dialog into
	 * @param {string} title Dialog title
	 * @param {string} message Dialog message
	 * @param {boolean} keyboardControls Whether to trap the focus inside the Dialog window for keyboard users
	 * @return {Observable<string>}
	 * @memberof DialogService
	 * @since 1.0.0
	 */
	open(entry: ViewContainerRef, title: string, message: string, keyboardControls?: boolean): Observable<string> {
		// Get factory object for the given component.
		const factory = this.resolver.resolveComponentFactory(DialogComponent);

		// Insert component and apply the necessary attributes.
		this.componentRef = entry.createComponent(factory);
		this.componentRef.instance.title = title;
		this.componentRef.instance.message = message;
		this.componentRef.instance.cancelEvent.subscribe(() => this.cancel());
		this.componentRef.instance.confirmEvent.subscribe(() => this.confirm());

		// If supplied, we apply the given Event info as well.
		if (keyboardControls) {
			this.componentRef.instance.keyboard = keyboardControls;
		}

		// Create new Observable for the Dialog component and return it.
		this.componentSubscriber = new Subject<string>();
		return this.componentSubscriber.asObservable();
	}

	/**
	 * close
	 *
	 * Close the Dialog component and destroy it.
	 *
	 * @memberof DialogService
	 * @since 1.0.0
	 */
	close(): void {
		this.componentSubscriber.complete();
		this.componentRef.destroy();
	}

	/**
	 * cancel
	 *
	 * Send `cancel` message to the Subscription Observable.
	 * Handles the cancellation of the Dialog component.
	 *
	 * @memberof DialogService
	 * @since 1.0.0
	 */
	cancel() {
		this.componentSubscriber.next('cancel');
		this.close();
	}

	/**
	 * confirm
	 *
	 * Send `confirm` message to the Subscription Observable.
	 * Handles the confirmation of the Dialog component.
	 *
	 * @memberof DialogService
	 * @since 1.0.0
	 */
	confirm() {
		this.componentSubscriber.next('confirm');
		this.close();
	}
}
