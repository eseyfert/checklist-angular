import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ViewChild,
	ViewContainerRef,
	ChangeDetectorRef,
} from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SlideComponent } from '../../slide/slide.component';
import { SnackbarService } from 'src/app/snackbar.service';
import { ChecklistService } from 'src/app/checklist.service';
import { SELECTOR } from '../checklist.constants';
import { ChecklistData } from '../checklist.types';

/**
 * AddComponent
 *
 * Supplies template and functions for "adding" checklists.
 *
 * @export
 * @class AddComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 * @version 1.0.0
 */
@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.scss'],
	host: { class: 'mdf-slide' },
})
export class AddComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('checklist', { read: ViewContainerRef })
	checklist!: ViewContainerRef; // Contains our generated Checklist component content.

	constructor(
		private cdRef: ChangeDetectorRef,
		private app: AppComponent,
		private slide: SlideComponent,
		private service: ChecklistService,
		private snackbar: SnackbarService
	) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		// Insert the Checklist with the default `edit` template.
		this.service.insert(this.checklist);

		// Make sure to call detectChanges to avoid errors.
		this.cdRef.detectChanges();
	}

	ngOnDestroy(): void {
		// Destroy the Checklist component.
		this.service.destroy();
	}

	/**
	 * saveChecklist
	 *
	 * Save checklist to storage.
	 *
	 * @memberof AddComponent
	 * @since 1.0.0
	 */
	saveChecklist(): void {
		// Store all tasks in this array.
		const tasks: string[] = [];

		// Get all text inputs.
		const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(SELECTOR.input);

		// Push all input values to our array.
		for (const input of inputs) {
			if (input.value.length) {
				tasks.push(input.value);
			}
		}

		if (tasks.length) {
			// Get the checklist's title.
			const titleInput = document.querySelector(SELECTOR.titleInput);
			const title = (titleInput as HTMLInputElement).value;

			// Create object holding the new checklist data.
			const updateData: ChecklistData = {
				title: title,
				tasks: tasks,
			};

			// Send the new data to our service.
			this.service.update(updateData);

			// Save the data to storage.
			this.service.post().subscribe({
				next: () => {
					// Refresh the view of the Landing slide to show the newly added data.
					this.app.refreshLanding();

					// Return to the Landing slide.
					this.goBack();

					// Show snackbar message.
					this.snackbar.message(`Checklist successfully added`);
				},
			});
		}
	}

	/**
	 * goBack
	 *
	 * Return to the Landing slide.
	 *
	 * @memberof AddComponent
	 * @since 1.0.0
	 */
	goBack(): void {
		this.slide.moveSlidesTo('right');
	}
}
