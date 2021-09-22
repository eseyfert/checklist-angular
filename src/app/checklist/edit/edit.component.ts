import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ViewChild,
	ViewContainerRef,
	ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppComponent } from '../../app.component';
import { SlideComponent } from '../../slide/slide.component';
import { DialogService } from '../../dialog.service';
import { ChecklistService } from '../../checklist.service';
import { ChecklistData } from '../../checklist/checklist.types';
import { SELECTOR } from '../../checklist/checklist.constants';

/**
 * EditComponent
 *
 * Supplies template and functions for "editing" checklists.
 *
 * @export
 * @class EditComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 * @version 1.0.0
 */
@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.scss'],
	host: { class: 'mdf-slide' },
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('checklist', { read: ViewContainerRef })
	checklist!: ViewContainerRef; // Contains our generated Checklist component content.
	@ViewChild('dialog', { read: ViewContainerRef })
	dialog!: ViewContainerRef; // Contains the Dialog window.

	dialogSub!: Subscription; // Observable created from our Dialog component.

	constructor(
		private cdRef: ChangeDetectorRef,
		private app: AppComponent,
		private slide: SlideComponent,
		private service: ChecklistService,
		private dialogService: DialogService
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

		// Unsubscribe from the Dialog Observable.
		if (this.dialogSub) {
			this.dialogSub.unsubscribe();
		}
	}

	/**
	 * saveChanges
	 *
	 * Save the changes made to the checklist.
	 *
	 * @memberof EditComponent
	 * @since 1.0.0
	 */
	saveChanges(): void {
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
					this.slide.moveSlidesTo('right');
				},
			});
		}
	}

	/**
	 * deleteChecklist
	 *
	 * Delete the checklist from storage and return to the Landing slide.
	 *
	 * @memberof EditComponent
	 * @since 1.0.0
	 */
	deleteChecklist(): void {
		// Delete the checklist from storage.
		this.service.delete().subscribe({
			next: () => {
				// Refresh the view of the Landing slide to show the newly added data.
				this.app.refreshLanding();

				// Return to the Landing slide.
				this.slide.moveSlidesTo('right');
			},
		});
	}

	/**
	 * deleteDialog
	 *
	 * Shows Dialog window to confirm checklist deletion.
	 *
	 * @param {boolean} [keyboard=false] Whether keyboard controls are needed
	 * @memberof EditComponent
	 * @since 1.0.0
	 */
	deleteDialog(keyboard: boolean = false): void {
		this.dialogSub = this.dialogService
			.open(this.dialog, 'Delete checklist', 'Are you sure you want to delete this checklist?', keyboard)
			.subscribe((action) => {
				if (action === 'confirm') {
					this.deleteChecklist();
				}
			});
	}

	/**
	 * kbDeleteDialog
	 *
	 * Detect if the deletion Dialog was activated by keyboard input.
	 *
	 * @param {KeyboardEvent} $event
	 * @memberof EditComponent
	 * @since 1.0.0
	 */
	kbDeleteDialog($event: KeyboardEvent): void {
		if ($event.key === 'Enter' || $event.key === ' ') {
			$event.preventDefault();
			this.deleteDialog(true);
		}
	}

	/**
	 * goBack
	 *
	 * Return to the Landing slide.
	 *
	 * @memberof EditComponent
	 * @since 1.0.0
	 */
	goBack(): void {
		this.slide.moveSlidesTo('right');
	}
}
