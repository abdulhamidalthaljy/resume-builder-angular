import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeFormComponent } from './components/resume-form.component';
import { ResumePreviewComponent } from './components/resume-preview/resume-preview.component'; // <-- Add this

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ResumeFormComponent,
    ResumePreviewComponent // <-- Add here
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'resume-builder-angular';
  currentYear = new Date().getFullYear();

  // This will hold the entire resume data object from ResumeFormComponent
  currentResumeData: any = { // Initialize with empty structure for safety
    personalDetails: null,
    informationSummary: '',
    languages: [],
    workExperience: [],
    workshops: [],
    education: []
  };

  handleResumeDataChange(data: any): void {
    console.log('Data received in AppComponent for preview:', data);
    this.currentResumeData = data; // Update the whole object
  }
}