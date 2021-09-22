import {
	Component,
	OnInit,
	AfterViewInit,
	Input,
	ViewChild,
	ComponentFactoryResolver,
	ViewContainerRef,
} from '@angular/core';
import { InputComponent } from './input/input.component';
import { ChecklistData } from './checklist.types';
import { ChecklistService } from '../checklist.service';

/**
 * ChecklistComponent
 *
 * Creates the template for viewing and editing checklists.
 * Receives data from the Checklist service.
 *
 * @export
 * @class ChecklistComponent
 * @implements {OnInit}
 * @version 1.0.0
 */
@Component({
	selector: 'app-checklist',
	templateUrl: './checklist.component.html',
	styleUrls: ['./checklist.component.scss'],
})
export class ChecklistComponent implements OnInit, AfterViewInit {
	@ViewChild('inputs', { read: ViewContainerRef })
	inputs!: ViewContainerRef; // Contains our generated Input components.

	@Input() done: string[] = []; // Array of tasks marked as done.
	@Input() id: number = 0; // Unique checklist id.
	@Input() inputsCount: number = 1; // Number of created Input components. (Always start at 1)
	@Input() tasks: string[] = []; // Array of tasks.
	@Input() template: string = 'edit'; // Switch between two templates, `edit` and `view`.
	@Input() time: number = 0; // Timestamp of checklist creation.
	@Input() title: string = ''; // Checklist title.

	private titleInput!: HTMLInputElement;

	constructor(private componentFactoryResolver: ComponentFactoryResolver, private service: ChecklistService) {}

	ngOnInit() {}

	ngAfterViewInit() {
		// Check if we're using the `Edit` template.
		if (this.template === 'edit') {
			// Set focus to the title input at the top of the page.
			this.titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;

			// We use a timeout to make sure the slide animation finishes first.
			setTimeout(() => this.titleInput.focus(), 360);
		}
	}

	/**
	 * addInput
	 *
	 * Insert an Input component into our #Inputs container.
	 *
	 * @memberof ChecklistComponent
	 * @since 1.0.0
	 */
	addInput(): void {
		// Create factory object for the Input component.
		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputComponent);

		// Append the new component.
		const component = this.inputs.createComponent(componentFactory);

		// Increase the count for created inputs.
		this.inputsCount++;

		// Set id for Input component based on current # of inputs.
		component.instance.id = this.inputsCount;

		// Get the text input element inside the component.
		const input = component.location.nativeElement.querySelector('input[type="text"]');

		// Scroll the input into view and set focus on it.
		input.scrollIntoView();
		input.focus();
	}

	/**
	 * updateCount
	 *
	 * Updates the inputs count after an Input component gets removed.
	 *
	 * @memberof ChecklistComponent
	 * @since 1.0.0
	 */
	updateCount(): void {
		// Subtract from the count.
		this.inputsCount--;

		// Make sure the count can't drop below one.
		if (this.inputsCount < 1) {
			this.inputsCount = 1;
		}
	}

	/**
	 * removeTask
	 *
	 * Update the input count and remove the task from the `done` Array.
	 *
	 * @param {string} task The task to remove
	 * @memberof ChecklistComponent
	 * @since 1.0.0
	 */
	removeTask(task: string): void {
		this.updateCount();

		if (this.done.includes(task)) {
			// Get the index of the current task.
			const index = this.done.indexOf(task);

			// Remove the task from the `done` Array.
			this.done.splice(index, 1);
		}
	}

	/**
	 * completeTask
	 *
	 * Marks the given task as complete or incomplete on repeated calls.
	 *
	 * @param {string} task The task to check for
	 * @memberof ChecklistComponent
	 * @since 1.0.0
	 */
	completeTask(task: string): void {
		// Get the index of the current task.
		const index = this.done.indexOf(task);

		if (this.done.includes(task)) {
			// If the tasks is already complete, remove it from the Array.
			this.done.splice(index, 1);
		} else {
			// Otherwise add it.
			this.done.push(task);
		}

		// Prepare the new data.
		const data: ChecklistData = {
			done: this.done,
		};

		// Save the new data to storage.
		this.service.update(data);
		this.service.post().subscribe();
	}
}
