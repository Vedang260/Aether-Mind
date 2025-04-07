import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @ViewChild('categoryDialog') categoryDialog!: TemplateRef<any>;
  
  displayedColumns: string[] = ['id', 'name', 'icon', 'actions'];
  categories = new MatTableDataSource<any>([
    { id: 1, name: 'Technology', icon: 'code' },
    { id: 2, name: 'Science', icon: 'science' },
    { id: 3, name: 'Business', icon: 'business_center' },
    { id: 4, name: 'Health', icon: 'favorite' }
  ]);
  
  // Common Material icons for categories
  iconOptions = [
    { value: 'code', label: 'Code' },
    { value: 'science', label: 'Science' },
    { value: 'business_center', label: 'Business' },
    { value: 'favorite', label: 'Health' },
    { value: 'school', label: 'Education' },
    { value: 'public', label: 'World' },
    { value: 'star', label: 'Featured' },
    { value: 'event', label: 'Events' },
    { value: 'movie', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' }
  ];

  categoryForm: FormGroup;
  editingCategory: any = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      icon: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  openAddCategoryDialog() {
    this.editingCategory = null;
    this.categoryForm.reset();
    this.dialog.open(this.categoryDialog, {
      width: '500px',
      panelClass: 'custom-dialog'
    });
  }

  editCategory(category: any) {
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      icon: category.icon
    });
    this.dialog.open(this.categoryDialog, {
      width: '500px',
      panelClass: 'custom-dialog'
    });
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;
    
    const categoryData = this.categoryForm.value;
    
    if (this.editingCategory) {
      // Update existing category
      const index = this.categories.data.findIndex(c => c.id === this.editingCategory.id);
      if (index !== -1) {
        this.categories.data[index] = {
          ...this.categories.data[index],
          ...categoryData
        };
        this.categories.data = [...this.categories.data];
      }
    } else {
      // Add new category
      const newCategory = {
        id: this.categories.data.length + 1,
        ...categoryData
      };
      this.categories.data = [...this.categories.data, newCategory];
    }
    
    this.dialog.closeAll();
    this.showSnackbar(`Category ${this.editingCategory ? 'updated' : 'added'} successfully!`);
  }

  deleteCategory(id: number) {
    this.categories.data = this.categories.data.filter(c => c.id !== id);
    this.showSnackbar('Category deleted successfully!');
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'custom-snackbar'
    });
  }
}