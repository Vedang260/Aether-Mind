import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent }
    ]),
    MatFormFieldModule, // ✅ Required for <mat-form-field>
    MatSelectModule, // ✅ Required for <mat-select>
    MatOptionModule, // ✅ Required for <mat-option>
    MatButtonModule // ✅ Required for <button mat-raised-button>
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }