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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category, CategoryResponse } from '../../../../shared/models/category.model';
import { ApiResponse } from '../../../../shared/models/articles.model';
import { catchError, forkJoin, map, of } from 'rxjs';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { Subject, takeUntil } from 'rxjs';
import { RouterModule } from '@angular/router';
import { SearchService } from '../../../../core/services/search.service';

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
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ArticlesComponent implements OnInit {
  @ViewChild('articleDialog') articleDialog!: TemplateRef<any>;
  image_url: string = '';
  
  articles: any[] = [];
    selectedCategory: string | null = null;
    filteredArticles: any[] = [];
    categories: Category[] = []; 
    isLoading: boolean | undefined;
    error: string | undefined;
    searchResults: any[] = [];
    private destroy$ = new Subject<void>();
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

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient, 
    private searchService: SearchService

  ) {
    this.articleForm = this.fb.group({
      categoryId: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(10)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      introduction: ['', Validators.required],
      content: ['', Validators.required],
      conclusion: ['', Validators.required],
      didYouKnow: ['', Validators.required],
      quote: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

   ngOnInit(): void {
    this.fetchArticlesAndCategories();
    this.searchService.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        if (query.trim()) {
          this.searchArticles(query.trim());
        } else {
          this.searchResults = [];
        }
      });
  }

  private searchArticles(query: string): void {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>(`http://localhost:8000/api/search?q=${query}`, { headers })
      .subscribe(response => {
        this.searchResults = response.articles;
      });
  }

    fetchArticlesAndCategories(): void {
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Create requests for both articles and categories
      const articlesRequest = this.http.get<ApiResponse>('http://localhost:8000/api/articles', { headers });
      const categoriesRequest = this.http.get<CategoryResponse>('http://localhost:8000/api/category', { headers });

      // Use forkJoin to make both requests simultaneously
      forkJoin([articlesRequest, categoriesRequest]).pipe(
        catchError(error => {
          this.isLoading = false;
          this.error = error.message || 'Failed to load data. Please try again later.';
          return of([]);
        }),
        map(([articlesRes, categoriesRes]) => {
          // Check if both requests were successful
          if (!articlesRes.success || !categoriesRes.success) {
            throw new Error(articlesRes.message || categoriesRes.message || 'Failed to load data');
          }

          // Store categories for later use
          this.categories = categoriesRes.categories;

          // Map articles to the format your template expects
          return articlesRes.articles.map(article => ({
            id: article.article_id,
            title: article.title,
            description: article.description,
            tags: article.tags,
            category: this.getCategoryName(article.category_id),
            category_id: article.category_id,
            image: article.image_url,
            author: 'Unknown Author', // You can implement author lookup similarly
            authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg'
          }));
        })
        
      ).subscribe({
        next: (mappedArticles) => {
          this.articles = mappedArticles;
          this.filteredArticles = [...mappedArticles];
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Failed to load articles. Please try again later.';
        }
      });
    }
  
   // Add these methods to your component class
// In your component class
filterByCategory(categoryId: string | null): void {
  this.selectedCategory = categoryId;
  if (!categoryId) {
    this.filteredArticles = [...this.articles];
  } else {
    this.filteredArticles = this.articles.filter(article => article.category_id === categoryId);
  }
}

clearCategoryFilter(): void {
  this.filteredArticles = [...this.articles];
  this.selectedCategory = null;
}

// Make getCategoryName public since it's used in the template
getCategoryName(categoryId: string): string {
  const category = this.categories.find(c => c.category_id === categoryId);
  return category ? category.name : 'Uncategorized';
}
  
  initForm(){
    this.articleForm = this.fb.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        content: ['', Validators.required],
        category_id: ['', Validators.required],
        introduction: ['', Validators.required],
        didYouKnow: ['', Validators.required],
        conclusion: ['', Validators.required],
        quote: ['', Validators.required],
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
        categoryId: category?.category_id,
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

  uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      const formData = new FormData();
      formData.append('image', file);
  
      this.http.post<{success: boolean, message: string, image_url: string}>(
        'http://localhost:8000/api/articles/upload-image',
        formData,
        { headers }
      ).subscribe({
        next: (response) => {
          if (response.success) {
            resolve(response.image_url);
            
          } else {
            reject(response.message);
          }
        },
        error: (err) => {
          reject(err.error?.message || 'Failed to upload image');
        }
      });
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.articleForm.patchValue({ image: file }); // Update form control
        this.articleForm.get('image')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
  
      // Upload the image
      this.uploadImage(file)
        .then(imageUrl => {
          this.image_url = imageUrl; // Store the URL for form submission
          this.snackBar.open('Image uploaded successfully!', 'Close', { duration: 3000 });
          console.log("image: ", this.image_url);
        })
        .catch(error => {
          this.snackBar.open(`Upload failed: ${error}`, 'Close', { duration: 5000 });
          this.imagePreview = null;
          this.selectedFile = null;
        });
    }
  }

  async saveArticle() {
    console.log("Article form value: ", this.articleForm.value);

  // First, check if form is invalid
  if (this.articleForm.invalid) {
    this.snackBar.open('Please fill in all the required details', 'Close', { duration: 3000 });

    // Mark all controls as touched to show validation errors
    this.articleForm.markAllAsTouched();
    return;
  }

    // If we have a new file but no URL yet (upload in progress)
    if (this.selectedFile && !this.image_url) {
      this.snackBar.open('Please wait for image to finish uploading', 'Close', { duration: 3000 });
      return;
    }
  
    const formValue = this.articleForm.value;
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    const articleData = {
      title: formValue.title,
      description: formValue.description,
      content: formValue.content,
      introduction: formValue.introduction,
      conclusion: formValue.conclusion,
      did_you_know: formValue.didYouKnow,
      quote: formValue.quote,
      category_id: formValue.categoryId,
      image_url: this.image_url || this.editingArticle?.image_url,
    };
   console.log("Artile Data: ", articleData);
    try {
      let response;
      if (this.editingArticle) {
        // Update existing article
        response = await this.http.put<ApiResponse>(
          `http://localhost:8000/api/articles/${this.editingArticle.id}`,
          articleData,
          { headers }
        ).toPromise();
      } else {
        // Create new article
        response = await this.http.post<ApiResponse>(
          'http://localhost:8000/api/articles/create',
          articleData,
          { headers }
        ).toPromise();
      }
  
      if (response?.success) {
        this.snackBar.open(
          `Article ${this.editingArticle ? 'updated' : 'created'} successfully!`, 
          'Close', 
          { duration: 3000 }
        );
        this.fetchArticlesAndCategories(); // Refresh the list
        this.dialogRef?.close();
      } else {
        throw new Error(response?.message || 'Unknown error');
      }
    } catch (error: any) {
      this.snackBar.open(
        `Failed to save article: ${error.message}`,
        'Close',
        { duration: 5000 }
      );
    }
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