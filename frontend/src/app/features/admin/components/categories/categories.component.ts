import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { trigger, transition, style, animate } from '@angular/animations';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../shared/models/category.model';
import { MatSpinner } from '@angular/material/progress-spinner';

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
    MatSelectModule,
    MatPaginatorModule,
    MatSpinner
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CategoriesComponent implements OnInit {
  @ViewChild('categoryDialog') categoryDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'actions'];
  dataSource = new MatTableDataSource<Category>();
  categoryForm: FormGroup;
  editingCategory: Category | null = null;
  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.dataSource.paginator = this.paginator;
  }

  fetchCategories(): void {
    this.isLoading = true;
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.dataSource.data = response.categories;
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        } else {
          this.showSnackbar('Failed to load categories', 'error');
          this.isLoading = false;
        }
      },
      error: () => {
        this.showSnackbar('Error fetching categories', 'error');
        this.isLoading = false;
      }
    });
  }

  openAddCategoryDialog() {
    this.editingCategory = null;
    this.categoryForm.reset();
    this.dialog.open(this.categoryDialog, {
      width: '500px',
      panelClass: 'custom-dialog'
    });
  }

  editCategory(category: Category) {
    this.editingCategory = category;
    this.categoryForm.patchValue({ name: category.name });
    this.dialog.open(this.categoryDialog, {
      width: '500px',
      panelClass: 'custom-dialog'
    });
  }

  saveCategory() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const categoryData = this.categoryForm.value;

    if (this.editingCategory) {
      // Update category
      this.categoryService.updateCategory(this.editingCategory.category_id, categoryData).subscribe({
        next: (response) => {
          if(response.success){
            this.handleSuccess('Category updated successfully');
            this.fetchCategories();
          }
          else{
            this.handleError(response.message);
          }
           // Refresh list
        },
        error: () => this.handleError('Failed to update category')
      });
    } else {
      // Create new category
      this.categoryService.createCategory(categoryData).subscribe({
        next: (response) => {
          if(response.success){
            this.handleSuccess('Category added successfully');
            this.fetchCategories(); 
          }else{
            this.handleError(response.message);
          }
          // Refresh list
        },
        error: () => this.handleError('Failed to create category')
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.isLoading = true;
      this.categoryService.deleteCategory(id).subscribe({
        next: (response) => {
          if(response.success){
            this.handleSuccess('Category deleted successfully');
            this.fetchCategories(); // Refresh list
          }else{
            this.handleError(response.message);
          }
        },
        error: () => this.handleError('Failed to delete category')
      });
    }
  }

  handleSuccess(message: string) {
    this.showSnackbar(message, 'success');
    this.dialog.closeAll();
    this.isLoading = false;
  }

  handleError(message: string) {
    this.showSnackbar(message, 'error');
    this.isLoading = false;
  }

  showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}