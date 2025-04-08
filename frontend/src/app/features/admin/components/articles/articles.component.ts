import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { QuillModule } from 'ngx-quill';
import { HttpHeaders } from '@angular/common/http';
import { CategoryResponse } from '../../../../shared/models/category.model';
import { ApiResponse } from '../../../../shared/models/articles.model';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    QuillModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  @ViewChild('articleDialog') articleDialog!: TemplateRef<any>;
  
  categories: any[] = [];
  articles: any[] = [];
  image_url: string = '';
  
  articleForm: FormGroup;
  editingArticle: any = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  dialogRef?: MatDialogRef<any>;

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ],
    syntax: true
  };
  isLoading: boolean | undefined;
  error: string | undefined;
  http: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.articleForm = this.fb.group({
      categoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      introduction: ['', Validators.required],
      content: ['', Validators.required],
      conclusion: ['', Validators.required],
      didYouKnow: [''],
      quote: [''],
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    // Initialize Quill styles
    this.fetchArticlesAndCategories();
    this.initForm();
    this.loadQuillStyles();
  }

  fetchArticlesAndCategories(): void {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const articlesRequest = this.http.get<ApiResponse>('http://localhost:8000/api/articles', { headers })
  .pipe(catchError(error => of({ success: false, message: error.message, articles: [] } as ApiResponse)));

const categoriesRequest = this.http.get<CategoryResponse>('http://localhost:8000/api/category', { headers })
  .pipe(catchError(error => of({ success: false, message: error.message, categories: [] } as CategoryResponse)));

forkJoin([articlesRequest, categoriesRequest])
  .pipe(
    map(([articlesRes, categoriesRes]) => {
      if (!articlesRes.success || !categoriesRes.success) {
        throw new Error(articlesRes.message || categoriesRes.message || 'Failed to load data');
      }

      this.categories = categoriesRes.categories;

      return articlesRes.articles.map((article: { article_id: any; title: any; description: any; tags: any; category_id: any; image_url: any; }) => ({
        id: article.article_id,
        title: article.title,
        description: article.description,
        tags: article.tags,
        category: this.getCategoryName(article.category_id),
        image: article.image_url,
        author: 'Unknown Author',
        authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg'
      }));
    })
  )
  .subscribe({
    next: (articles) => {
      this.articles = articles;
      this.isLoading = false;
    },
    error: (error) => {
      this.isLoading = false;
      this.error = error.message || 'Failed to load data.';
    }
  });

  }
  
  initForm(){
    this.articleForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        content: ['', Validators.required],
        category_id: ['', Validators.required],
        image_url: ['', Validators.required]
      });
  }
  private loadQuillStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
      .ql-container { font-family: 'Inter', sans-serif; }
      .ql-editor { min-height: 150px; }
    `;
    document.head.appendChild(style);
  }

  openArticleForm(article?: any) {
    this.editingArticle = article || null;
    this.imagePreview = article?.image || null;
    this.selectedFile = null;
    
    if (article) {
      const category = this.categories.find(c => c.name === article.category);
      this.articleForm.patchValue({
        categoryId: category?.id,
        title: article.title,
        description: article.description,
        image: article.image
      });
    } else {
      this.articleForm.reset();
    }
    
    this.dialogRef = this.dialog.open(this.articleDialog, {
      width: '800px',
      maxHeight: '90vh',
      panelClass: 'article-dialog'
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.articleForm.patchValue({ image: file });
      this.articleForm.get('image')?.updateValueAndValidity();
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveArticle() {
    if (this.articleForm.invalid) {
      this.markFormGroupTouched(this.articleForm);
      return;
    }
    
    const formValue = this.articleForm.value;
    const category = this.categories.find(c => c.id === formValue.categoryId);
    
    if (this.editingArticle) {
      // Update article
      const index = this.articles.findIndex(a => a.id === this.editingArticle.id);
      if (index !== -1) {
        this.articles[index] = {
          ...this.articles[index],
          ...formValue,
          category: category?.name || 'Uncategorized',
          image: this.imagePreview || this.articles[index].image
        };
      }
    } else {
      // Add new article
      const newArticle = {
        id: Math.max(...this.articles.map(a => a.id)) + 1,
        ...formValue,
        category: category?.name || 'Uncategorized',
        image: this.imagePreview || 'assets/default-article.jpg',
        views: 0,
        date: new Date().toISOString().split('T')[0]
      };
      this.articles = [newArticle, ...this.articles];
    }
    
    this.dialogRef?.close();
    this.showSnackbar(`Article ${this.editingArticle ? 'updated' : 'added'} successfully!`);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: 'custom-snackbar'
    });
  }

  deleteArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
    this.showSnackbar('Article deleted successfully!');
  }
}