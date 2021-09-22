import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { SlideComponent } from '../slide/slide.component';
import { PreferencesComponent } from '../preferences/preferences.component';
import { MDFTabs } from '../tabs';
import { AddComponent } from '../checklist/add/add.component';
import { EditComponent } from '../checklist/edit/edit.component';
import { ViewComponent } from '../checklist/view/view.component';
import { ChecklistData } from '../checklist/checklist.types';
import { ChecklistService } from '../checklist.service';

/**
 * LandingComponent
 *
 * Initial view, either displays the available checklists or instructs the user to add their first one.
 *
 * @export
 * @class LandingComponent
 * @implements {OnInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
	host: { class: 'mdf-slide' },
})
export class LandingComponent implements OnInit, AfterViewInit {
	@Input() checklistData: ChecklistData[] = []; // Holds all checklists.
	@Input() complete: number = 0; // Number of complete checklists.
	@Input() open: number = 0; // Number of open checklists.

	constructor(private app: AppComponent, private slide: SlideComponent, private checklist: ChecklistService) {}

	ngOnInit(): void {
		// On init, fill our checklist data array.
		this.checklist.keys().subscribe({
			next: (key) => {
				// Using the id as they key, we look up the checklist data we need and push it to the array.
				this.checklist.get(key).subscribe((data) => {
					// Push the checklist data to our data array.
					const _data = data as ChecklistData;
					this.checklistData.push(_data);

					// Check if the checklist is open or complete and add to the respective counter.
					if (_data.complete) {
						this.complete++;
					} else {
						this.open++;
					}
				});
			},
		});
	}

	ngAfterViewInit(): void {
		// Initialize Tabs after a short timeout.
		setTimeout(() => new MDFTabs(), 60);
	}

	/**
	 * openPreferences
	 *
	 * Slide in the Preferences component.
	 *
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	openPreferences(): void {
		// Insert the Preferences component.
		this.app.insertComponent(PreferencesComponent);

		// Move the Slides to the left to reveal the new component.
		this.slide.initSlide();
		this.slide.moveSlidesTo('left');
	}

	/**
	 * openAdd
	 *
	 * Slide in the Add component.
	 *
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	openAdd(): void {
		// Reset the checklist data.
		this.checklist.reset();

		// Insert the Add component.
		this.app.insertComponent(AddComponent);

		// Move the Slides to the left to reveal the new component.
		this.slide.initSlide();
		this.slide.moveSlidesTo('left');
	}

	/**
	 * openEdit
	 *
	 * Slide in the Edit component.
	 *
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	openEdit(id: number): void {
		this.checklist.get(id.toString()).subscribe({
			next: (data) => {
				// Retrieve the checklist data for the given id and forward it to the service.
				const _data = data as ChecklistData;
				this.checklist.prepare(_data.id!, _data);
			},
			complete: () => {
				// Once ready, we insert the Edit component.
				this.app.insertComponent(EditComponent, true);

				// Move the Slides to the left to reveal the new component.
				this.slide.initSlide();
				this.slide.moveSlidesTo('left');
			},
		});
	}

	/**
	 * openView
	 *
	 * Slide in the View component.
	 *
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	openView(id: number): void {
		this.checklist.get(id.toString()).subscribe({
			next: (data) => {
				// Retrieve the checklist data for the given id and forward it to the service.
				const _data = data as ChecklistData;
				this.checklist.prepare(_data.id!, _data);
			},
			complete: () => {
				// Once ready, we insert the View component.
				this.app.insertComponent(ViewComponent, true);

				// Move the Slides to the left to reveal the new component.
				this.slide.initSlide();
				this.slide.moveSlidesTo('left');
			},
		});
	}

	/**
	 * hasData
	 *
	 * Returns whether or not we have any checklist data available.
	 *
	 * @return {*}  {boolean}
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	hasData(): boolean {
		return this.checklistData.length > 0;
	}

	/**
	 * removeChecklist
	 *
	 * Remove checklist from storage.
	 *
	 * @memberof LandingComponent
	 * @since 1.0.0
	 */
	removeChecklist(id: number): void {
		// Delete the checklist with the given id.
		this.checklist.delete(id).subscribe({
			complete: () => {
				// Once done, update the counter of complete checklists.
				this.complete--;
			},
		});
	}
}
