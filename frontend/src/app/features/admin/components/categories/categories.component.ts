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
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../shared/models/category.model';

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
  
  displayedColumns: string[] = ['id', 'name', 'actions'];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  categoryForm: FormGroup;
  editingCategory: any = null;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }


  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories;
          this.filteredCategories = [...this.categories];
        } else {
          console.error(response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  openAddCategoryDialog() {
    // this.editingCategory = null;
    // this.categoryForm.reset();
    // this.dialog.open(this.categoryDialog, {
    //   width: '500px',
    //   panelClass: 'custom-dialog'
    // });
  }

  editCategory(category: any) {
    // this.editingCategory = category;
    // this.categoryForm.patchValue({
    //   name: category.name,
    // });
    // this.dialog.open(this.categoryDialog, {
    //   width: '500px',
    //   panelClass: 'custom-dialog'
    // });
  }

  saveCategory() {
  //   if (this.categoryForm.invalid) return;
    
  //   const categoryData = this.categoryForm.value;
    
  //   if (this.editingCategory) {
  //     // Update existing category
  //     const index = this.categories.findIndex(c => c.id === this.editingCategory.id);
  //     if (index !== -1) {
  //       this.categories.[index] = {
  //         ...this.categories.[index],
  //         ...categoryData
  //       };
  //       this.categories = [...this.categories.data];
  //     }
  //   } else {
  //     // Add new category
  //     const newCategory = {
  //       id: this.categories.length + 1,
  //       ...categoryData
  //     };
  //     this.categories = [...this.categories.data, newCategory];
  //   }
    
  //   this.dialog.closeAll();
  //   this.showSnackbar(`Category ${this.editingCategory ? 'updated' : 'added'} successfully!`);
  }

  deleteCategory(id: number) {
    // this.categories.data = this.categories.data.filter(c => c.id !== id);
    // this.showSnackbar('Category deleted successfully!');
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'custom-snackbar'
    });
  }
}