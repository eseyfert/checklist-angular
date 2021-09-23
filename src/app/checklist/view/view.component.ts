import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ComponentRef,
	ViewChild,
	ViewContainerRef,
	ChangeDetectorRef,
} from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { SlideComponent } from '../../slide/slide.component';
import { SnackbarService } from 'src/app/snackbar.service';
import { ChecklistComponent } from '../checklist.component';
import { ChecklistService } from '../../checklist.service';

/**
 * ViewComponent
 *
 * Supplies template and functions for "viewing" checklists.
 *
 * @export
 * @class ViewComponent
 * @implements {OnInit}
 * @implements {AfterViewInit}
 * @implements {OnDestroy}
 * @version 1.0.0
 */
@Component({
	selector: 'app-view',
	templateUrl: './view.component.html',
	styleUrls: ['./view.component.scss'],
	host: { class: 'mdf-slide' },
})
export class ViewComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('checklist', { read: ViewContainerRef })
	checklist!: ViewContainerRef; // Contains our generated Checklist component content.

	private componentRef!: ComponentRef<ChecklistComponent>; // Store reference for the Checklist component.

	constructor(
		private cdRef: ChangeDetectorRef,
		private app: AppComponent,
		private slide: SlideComponent,
		private service: ChecklistService,
		private snackbar: SnackbarService
	) {}

	ngOnInit(): void {}

	ngAfterViewInit(): void {
		// Insert the Checklist with the `view` template.
		this.componentRef = this.service.insert(this.checklist, 'view');

		// Make sure to call detectChanges to avoid errors.
		this.cdRef.detectChanges();
	}

	ngOnDestroy(): void {
		// Destroy the Checklist component.
		this.service.destroy;
	}

	/**
	 * completeTask
	 *
	 * Sets the given task as either done or incomplete.
	 *
	 * @param {string} task The task to change
	 * @memberof ViewComponent
	 * @since 1.0.0
	 */
	completeTask(task: string): void {
		// Store the completed tasks so far.
		const completedTasks = this.componentRef.instance.done;

		// Get the index of the current task.
		const index = this.componentRef.instance.done.indexOf(task);

		if (completedTasks.includes(task)) {
			// If the tasks is already complete, remove it from the array.
			completedTasks.splice(index, 1);
		} else {
			// Otherwise add it.
			completedTasks.push(task);
		}

		// Overwrite the completed tasks in our checklist data.
		this.componentRef.instance.done = completedTasks;

		// Save the new data to storage.
		this.service.update({ done: completedTasks });
		this.service.post().subscribe();
	}

	/**
	 * setAsComplete
	 *
	 * Set checklist as complete and return to the Landing.
	 *
	 * @memberof ViewComponent
	 * @since 1.0.0
	 */
	setAsComplete(): void {
		// Save the new data to storage.
		this.service.update({
			done: this.componentRef.instance.tasks,
			complete: true,
		});
		this.service.post().subscribe({
			// After the data is saved, return to the Landing.
			complete: () => {
				this.goBack();

				// Display message to user.
				this.snackbar.message('Checklist set as complete');
			},
		});
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
		this.app.refreshLanding();
		this.slide.moveSlidesTo('right');
	}
}
