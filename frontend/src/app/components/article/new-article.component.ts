import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from '../../core/services/article.service'; // Hypothetical service
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/models/category.model';
@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './new-article.component.html',
  styleUrls: ['./new-article.component.css'],
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
export class NewArticleComponent implements OnInit {
  articleForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isGenerating = false;
  image_url: string | null = null;
  isEditMode = false;
  articleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {
    this.articleForm = this.fb.group({
      category_id: ['', Validators.required],
      image_url: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      quote: ['', Validators.required],
      introduction: ['', Validators.required],
      content: ['', Validators.required],
      did_you_know: ['', Validators.required],
      conclusion: ['', Validators.required]
    });
  }

  ngOnInit() {

    // Load categories
    this.loadCategories();

    // Check if in edit mode
    this.articleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.articleId;

    // If edit mode, fetch article data
    if (this.isEditMode && this.articleId) {
      this.loadArticleData(this.articleId);
    }
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.categories; // Assuming { id, name } structure
      },
      error: () => {
        this.toastr.error('Failed to load categories', 'Error');
      }
    });
  }

  loadArticleData(article_id: string) {
    this.isLoading = true;
    this.articleService.getArticle(article_id).subscribe({
      next: (response: any) => {
        const article = response.article;
        this.image_url = article.image_url;
        this.articleForm.patchValue({
          category_id: article.category_id,
          image_url: article.image_url,
          title: article.title,
          description: article.description,
          quote: article.quote,
          introduction: article.introduction,
          content: article.content,
          did_you_know: article.did_you_know,
          conclusion: article.conclusion
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Failed to load article', 'Error');
        this.isLoading = false;
      }
    });
  }

  onImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('image', file);

      this.articleService.uploadImage(formData).subscribe({
        next: (response: any) => {
          this.image_url = response.image_url;
          this.articleForm.patchValue({ image_url: this.image_url });
          this.toastr.success('Image uploaded successfully', 'Success');
          this.isLoading = false;
        },
        error: () => {
          this.toastr.error('Failed to upload image', 'Error');
          this.isLoading = false;
        }
      });
    }
  }

  generateWithAI() {
    if (!this.image_url) {
      this.toastr.warning('Please upload an image first', 'Warning');
      return;
    }

    this.isGenerating = true;
    this.articleService.generateArticleWithAI(this.image_url).subscribe({
      next: (response: any) => {
        const aiData = response.article;
        this.articleForm.patchValue({
          title: aiData.title,
          description: aiData.description,
          quote: aiData.quote,
          introduction: aiData.introduction,
          content: aiData.content,
          did_you_know: aiData.did_you_know,
          conclusion: aiData.conclusion
        });
        this.toastr.success('Article generated successfully', 'Success');
        this.isGenerating = false;
      },
      error: () => {
        this.toastr.error('Failed to generate article', 'Error');
        this.isGenerating = false;
      }
    });
  }

  onSubmit() {
    if (this.articleForm.invalid) {
      this.articleForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const articleData = this.articleForm.value;

    if (this.isEditMode && this.articleId) {
      // Update existing article
      this.articleService.updateArticle(this.articleId, articleData).subscribe({
        next: () => this.handleSuccess('Article updated successfully'),
        error: () => this.handleError('Failed to update article')
      });
    } else {
      // Create new article
      this.articleService.createArticle(articleData).subscribe({
        next: () => this.handleSuccess('Article created successfully'),
        error: () => this.handleError('Failed to create article')
      });
    }
  }

  handleSuccess(message: string) {
    this.toastr.success(message, 'Success');
    this.router.navigate(['/admin/articles']);
    this.isLoading = false;
  }

  handleError(message: string) {
    this.toastr.error(message, 'Error');
    this.isLoading = false;
  }

  onCancel() {
    this.router.navigate(['/admin/articles']);
  }
}