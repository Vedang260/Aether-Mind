import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent }
    ]),
    MatFormFieldModule, // ✅ Required for <mat-form-field>
    MatSelectModule, // ✅ Required for <mat-select>
    MatOptionModule, // ✅ Required for <mat-option>
    MatButtonModule // ✅ Required for <button mat-raised-button>
  ],
  exports: [HomeComponent]
})
export class HomeModule { }