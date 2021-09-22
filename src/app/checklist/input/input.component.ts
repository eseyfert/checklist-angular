import { Component, OnInit, Input } from '@angular/core';
import { ChecklistComponent } from '../checklist.component';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
	@Input() id: number = 1; // ID of the current input, based on # of created inputs.
	@Input() value: string = ''; // Get the input value.

	constructor(private checklist: ChecklistComponent) {}

	ngOnInit(): void {}

	getCount(): number {
		return this.checklist.inputsCount;
	}

	updateCount(): void {
		this.checklist.updateCount();
	}
}
