import { Injectable, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ChecklistComponent } from './checklist/checklist.component';
import { ChecklistData } from './checklist/checklist.types';

/**
 * ChecklistService
 *
 * Handles Checklist component data and template injection.
 * Supplies methods to manipulate checklist storage data.
 *
 * @export
 * @class ChecklistService
 * @version 1.0.0
 */
@Injectable({
	providedIn: 'root',
})
export class ChecklistService {
	data!: ChecklistData | null; // Data of the current checklist.
	id!: number | null; // Id of the current checklist.

	private checklistRef!: ComponentRef<ChecklistComponent>; // Checklist component reference.

	constructor(private resolver: ComponentFactoryResolver, private storage: StorageMap) {}

	/**
	 * generateUUID
	 *
	 * Generate a unique ID for the checklist.
	 *
	 * @return {*} {number}
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	generateUUID(): number {
		// Set min and max values.
		const min = 0;
		const max = 8;

		// This will generate an Array holding different integers.
		const baseArray = window.crypto.getRandomValues(new Uint32Array(max));

		// We use this seed to pick a random number between the set min and the max range.
		const seed = Math.floor(Math.random() * (max - 1 - min) + min);

		// Select the UUID from the array.
		const uuid = baseArray[seed];

		// Return the UUID as an absolute value.
		return Math.abs(uuid + Date.now());
	}

	/**
	 * insert
	 *
	 * Insert the Checklist component at the given ViewContainerRef.
	 *
	 * @param {ViewContainerRef} entry Where to insert the Checklist
	 * @param {string} [template] What template to use. Either `view` or `edit`
	 * @return {*} {ComponentRef<ChecklistComponent>}
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	insert(entry: ViewContainerRef, template?: string): ComponentRef<ChecklistComponent> {
		// Get factory object for the given component.
		const factory = this.resolver.resolveComponentFactory(ChecklistComponent);

		// Insert Checklist component and apply data if available.
		this.checklistRef = entry.createComponent(factory);

		if (this.data && this.data.tasks?.length) {
			// If we have data available, pass it to the component.
			this.checklistRef.instance.id = this.data.id!;
			this.checklistRef.instance.title = this.data.title!;
			this.checklistRef.instance.tasks = this.data.tasks!;
			this.checklistRef.instance.done = this.data.done!;
			this.checklistRef.instance.time = this.data.time!;

			// Set the correct # of created inputs.
			this.checklistRef.instance.inputsCount = this.data.tasks!.length;
		} else {
			// Generate an unique ID for the new checklist we are creating.
			this.id = this.generateUUID();

			// Prepare our data object.
			this.data = {
				id: this.id,
				title: '',
				tasks: [],
				done: [],
				time: Date.now(),
				complete: false,
			};

			// Pass the id to the Checklist component.
			this.checklistRef.instance.id = this.id;
		}

		// If available, pass the template type to the component.
		if (template) {
			this.checklistRef.instance.template = template;
		}

		// Return reference to the created Checklist component.
		return this.checklistRef;
	}

	/**
	 * prepare
	 *
	 * Prepares the service by setting the supplied id and data.
	 *
	 * @param {number} id Checklist id
	 * @param {ChecklistData} data Checklist data
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	prepare(id: number, data: ChecklistData): void {
		this.data = data;
		this.id = id;
	}

	/**
	 * reset
	 *
	 * Reset stored data and generate new id.
	 *
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	reset(): void {
		this.id = this.generateUUID();

		this.data = {
			id: this.id,
			title: '',
			tasks: [],
			done: [],
			time: Date.now(),
			complete: false,
		};
	}

	/**
	 * update
	 *
	 * Update the existing data by merging it with the supplied data object.
	 *
	 * @param {ChecklistData} newData The object to merge our data with
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	update(newData: ChecklistData): void {
		this.data = { ...this.data, ...newData };
	}

	/**
	 * keys
	 *
	 * Return Observable holding all checklist ids.
	 *
	 * @return {*} {Observable<string>}
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	keys(): Observable<string> {
		return this.storage.keys();
	}

	/**
	 * get
	 *
	 * Return Observable holding data for the given checklist id.
	 *
	 * @param {string} id
	 * @return {*} {Observable<unknown>}
	 * @memberof ChecklistService
	 */
	get(id: string): Observable<unknown> {
		return this.storage.get(id);
	}

	/**
	 * post
	 *
	 * Save data to storage with the currently available id and data.
	 *
	 * @return {*} {Observable<unknown>}
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	post(): Observable<unknown> {
		return this.storage.set(this.id!.toString(), this.data);
	}

	/**
	 * delete
	 *
	 * Delete checklist from storage.
	 * Uses either the currently available or the function supplied id.
	 *
	 * @param {number} [id] Checklist id
	 * @return {*} {Observable<unknown>}
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	delete(id?: number): Observable<unknown> {
		if (id) {
			return this.storage.delete(id.toString());
		} else {
			return this.storage.delete(this.id!.toString());
		}
	}

	/**
	 * destroy
	 *
	 * Destroy the created Checklist component.
	 *
	 * @memberof ChecklistService
	 * @since 1.0.0
	 */
	destroy(): void {
		this.checklistRef.destroy();
	}
}
