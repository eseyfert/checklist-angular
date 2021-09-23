import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { SlideComponent } from './slide/slide.component';
import { LandingComponent } from './landing/landing.component';
import { AddComponent } from './checklist/add/add.component';
import { ChecklistService } from './checklist.service';
import { ChecklistComponent } from './checklist/checklist.component';
import { InputComponent } from './checklist/input/input.component';
import { EditComponent } from './checklist/edit/edit.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogService } from './dialog.service';
import { ViewComponent } from './checklist/view/view.component';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { SnackbarService } from './snackbar.service';

@NgModule({
	declarations: [
		AppComponent,
		SlideComponent,
		LandingComponent,
		PreferencesComponent,
		ChecklistComponent,
		AddComponent,
		InputComponent,
		EditComponent,
		DialogComponent,
		ViewComponent,
		SnackbarComponent,
	],
	imports: [BrowserModule, AppRoutingModule, FormsModule],
	providers: [
		DialogService,
		ChecklistService,
		SnackbarService,
		SlideComponent,
		DialogComponent,
		SnackbarComponent,
		ChecklistComponent,
		InputComponent,
		AddComponent,
		EditComponent,
		LandingComponent,
		PreferencesComponent,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
