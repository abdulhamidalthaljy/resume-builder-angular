import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PersonalDetails } from '../models/personal-details.model';
import { Language } from '../models/language.model';
import { WorkExperience } from '../models/work-experience.model';
import { Workshop } from '../models/workshop.model';
import { Education } from '../models/education.model';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { LanguageEntryComponent } from './language-entry/language-entry.component'; 
import { WorkExperienceEntryComponent } from './work-experience-entry/work-experience-entry.component';
import { WorkshopEntryComponent } from './workshop-entry/workshop-entry.component';
import { EducationEntryComponent } from './education-entry/education-entry.component';
import { ResumeService } from '../services/resume.service';
import { AIService } from '../services/ai.service';
import { AIInputDialogComponent } from './ai-input-dialog/ai-input-dialog.component';

@Component({
  selector: 'app-resume-form',
   standalone: true, 
  imports: [
    CommonModule,    
    FormsModule,
     LanguageEntryComponent,
    WorkExperienceEntryComponent,
       WorkshopEntryComponent,
    EducationEntryComponent,
    AIInputDialogComponent,
  ],
  templateUrl: './resume-form.component.html',
  styleUrls: ['./resume-form.component.css'], // or .scss
})
export class ResumeFormComponent implements OnInit {
  // --- Data Properties ---
  personalDetails: PersonalDetails = {
    name: '',
    birthDate: '',
    address: '',
    familyStatus: '',
    email: '',
    phone: '',
    nationality: '',
    itSkills: '',
    strengths: '',
    imageUrl: null,
  };
  informationSummary: string = ''; // Renamed from 'information' for clarity

  // For dynamic sections, initialize with one empty item for user convenience
  languages: Language[] = [{ name: '', level: '' }];
  workExperience: WorkExperience[] = [
    { company: '', position: '', date: '', description: '' },
  ];
  workshops: Workshop[] = [{ title: '', place: '', date: '' }];
  education: Education[] = [{ school: '', degree: '', place: '', date: '' }];

  // Output event to notify parent (AppComponent) of data changes
  @Output() dataChanged = new EventEmitter<any>();

  // Add resumeId property at the top of the class with other properties
  resumeId: string = '';

  showAIDialog = false;

  constructor(
    private resumeService: ResumeService,
    private aiService: AIService
  ) {}

  ngOnInit(): void {
    // Optionally, emit initial data when component loads
    this.emitDataChanges();
  }

  // --- Helper to emit all data ---
  private emitDataChanges(): void {
    const currentResumeData = {
      personalDetails: { ...this.personalDetails }, // Create a shallow copy
      informationSummary: this.informationSummary,
      languages: [...this.languages.map((l) => ({ ...l }))], // Deep copy array of objects
      workExperience: [...this.workExperience.map((w) => ({ ...w }))],
      workshops: [...this.workshops.map((w) => ({ ...w }))],
      education: [...this.education.map((e) => ({ ...e }))],
    };
    this.dataChanged.emit(currentResumeData);
  }

  // --- General Form Input Change Handler ---
  // Call this after any ngModel change if direct property binding doesn't trigger detection enough for parent
  onFieldChange(): void {
    this.emitDataChanges();
  }

  // --- Image Handling ---
  handleImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.personalDetails.imageUrl = e.target.result;
        this.emitDataChanges(); // Emit after image is loaded
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.personalDetails.imageUrl = null;
    // Reset the file input (a bit hacky in plain JS/TS, easier with Angular Forms API later)
    const fileInput = document.getElementById(
      'file-upload-input'
    ) as HTMLInputElement; // Add an ID to your file input
    if (fileInput) {
      fileInput.value = '';
    }
    this.emitDataChanges();
  }

  // --- "AI Fill" and "Reset" ---
  async fillWithAI() {
    this.showAIDialog = true;
  }

  async handleAIInput(userInput: string) {
    try {
      // Show loading state
      const loadingToast = alert('Generating resume content...');

      // Generate all sections in parallel
      const [personalDetails, summary, workExperience, education, languages] =
        await Promise.all([
          this.aiService.generatePersonalDetails(userInput),
          this.aiService.generateInformationSummary(userInput),
          this.aiService.generateWorkExperience(userInput),
          this.aiService.generateEducation(userInput),
          this.aiService.generateLanguages(userInput),
        ]);

      // Update personal details
      this.personalDetails = {
        ...this.personalDetails,
        ...personalDetails,
      };

      // Update summary
      this.informationSummary = summary;

      // Update work experience
      this.workExperience = workExperience;

      // Update education
      this.education = education;

      // Update languages
      this.languages = languages;

      // Notify of changes
      this.emitDataChanges();

      // Hide loading state and show success message
      alert('Resume content generated successfully!');
    } catch (error) {
      console.error('Error generating resume content:', error);
      alert('Error generating resume content. Please try again.');
    } finally {
      this.showAIDialog = false;
    }
  }

  handleAICancel() {
    this.showAIDialog = false;
  }

  // Replace the existing fillWithAIDemo method with this:
  fillWithAIDemo(): void {
    this.fillWithAI();
  }

  resetForm(): void {
    this.personalDetails = {
      name: '',
      birthDate: '',
      address: '',
      familyStatus: '',
      email: '',
      phone: '',
      nationality: '',
      itSkills: '',
      strengths: '',
      imageUrl: null,
    };
    this.informationSummary = '';
    this.languages = [{ name: '', level: '' }];
    this.workExperience = [
      { company: '', position: '', date: '', description: '' },
    ];
    this.workshops = [{ title: '', place: '', date: '' }];
    this.education = [{ school: '', degree: '', place: '', date: '' }];
    this.removeImage(); // Also clears the file input if an image was selected
    alert('Form Reset!');
    this.emitDataChanges();
  }

  // --- Placeholder methods for dynamic sections (to be expanded in Phase 3) ---
  // We'll add these now so the template doesn't break, but the actual logic for
  // adding/removing will be more refined when we create child components.
// Add this method inside ResumeFormComponent class
trackByIndex(index: number, item: any): any {
  return index; // Or a unique ID if your items have one
}
  addLanguage(): void {
    this.languages.push({ name: '', level: '' });
    this.emitDataChanges();
  }
  removeLanguage(index: number): void {
    this.languages.splice(index, 1);
    this.emitDataChanges();
  }

  addWorkExperience(): void {
    this.workExperience.push({
      company: '',
      position: '',
      date: '',
      description: '',
    });
    this.emitDataChanges();
  }
  removeWorkExperience(index: number): void {
    this.workExperience.splice(index, 1);
    this.emitDataChanges();
  }

  addWorkshop(): void {
    this.workshops.push({ title: '', place: '', date: '' });
    this.emitDataChanges();
  }
  removeWorkshop(index: number): void {
    this.workshops.splice(index, 1);
    this.emitDataChanges();
  }

  addEducation(): void {
    this.education.push({ school: '', degree: '', place: '', date: '' });
    this.emitDataChanges();
  }
  removeEducation(index: number): void {
    this.education.splice(index, 1);
    this.emitDataChanges();
  }
    // NEW method to handle changes from the child component
  handleLanguageEntryChange(updatedLanguage: Language, index: number): void {
    // Ensure the change is reflected in the main languages array.
    // This might already be handled by [(ngModel)] if the object reference is the same.
    // However, explicitly updating can be safer for change detection or if you need to do more.
    // this.languages[index] = updatedLanguage; // This line might not be strictly necessary
                                              // if language is passed by reference and ngModel works directly on it.
                                              // But it's good for clarity or if further processing is needed.
    this.emitDataChanges(); // Crucial: notify AppComponent that overall data changed
  }

  handleWorkExperienceEntryChange(
    updatedExperience: WorkExperience,
    index: number
  ): void {
    // this.workExperience[index] = updatedExperience; // As before, ngModel might handle this.
    this.emitDataChanges(); // Notify AppComponent
  }
    handleWorkshopEntryChange(updatedWorkshop: Workshop, index: number): void {
    this.emitDataChanges(); // Notify AppComponent
  }
  handleEducationEntryChange(
    updatedEducationItem: Education,
    index: number
  ): void {
    this.emitDataChanges(); // Notify AppComponent
  }

  // Add new methods for API interactions
  async saveResume() {
    try {
      const resumeData = {
        personalDetails: this.personalDetails,
        informationSummary: this.informationSummary,
        languages: this.languages,
        workExperience: this.workExperience,
        workshops: this.workshops,
        education: this.education,
      };

      // If we have an existing resumeId, update it, otherwise create new
      if (this.resumeId) {
        await this.resumeService.updateResume(this.resumeId, resumeData);
        alert('Resume updated successfully!');
      } else {
        const response = await this.resumeService.createResume(resumeData);
        this.resumeId = response.id; // Store the ID for future updates
        alert('Resume saved successfully!');
      }
    } catch (error) {
      alert('Error saving resume. Please try again.');
      console.error('Error saving resume:', error);
    }
  }

  async loadResume(id: string) {
    try {
      const resume = await this.resumeService.getResumeById(id);
      this.resumeId = id;
      this.personalDetails = resume.personalDetails;
      this.informationSummary = resume.informationSummary;
      this.languages = resume.languages;
      this.workExperience = resume.workExperience;
      this.workshops = resume.workshops;
      this.education = resume.education;
      this.emitDataChanges();
    } catch (error) {
      alert('Error loading resume. Please try again.');
      console.error('Error loading resume:', error);
    }
  }

  async deleteResume() {
    if (!this.resumeId) {
      alert('No resume to delete');
      return;
    }

    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await this.resumeService.deleteResume(this.resumeId);
        this.resetForm();
        this.resumeId = '';
        alert('Resume deleted successfully!');
      } catch (error) {
        alert('Error deleting resume. Please try again.');
        console.error('Error deleting resume:', error);
      }
    }
  }
}
