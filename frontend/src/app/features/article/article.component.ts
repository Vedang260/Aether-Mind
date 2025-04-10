import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule 
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild('summaryDialog') summaryDialog!: TemplateRef<any>;
  article: any = {};
  loading: boolean = true;
  comments: any[] = [];
  userRating: number | null = null;
  hoverRating: number | null = null;
  ratingMessage: string = 'Please rate this article';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
  ) {}

  newComment = '';
  isLongArticle = true;
  animatedSummary: string = '';
  isTyping: boolean = false;

  ngOnInit(): void {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Fetch article
      this.http.get<any>(`http://localhost:8000/api/articles/${articleId}`, {headers})
        .subscribe({
          next: (response) => {
            this.article = response.article;
            this.loading = false;
            this.fetchUserRating(articleId, headers);
          },
          error: (error) => {
            console.error('Error fetching article:', error);
            this.loading = false;
          }
        });

      // Fetch comments
      this.http.get<any>(`http://localhost:8000/api/comments/${articleId}`, {headers}).subscribe({
        next: (response) => {
          if (response.success) {
            this.comments = response.comments.map((comment: any) => ({
              user: {
                name: comment.user.username,
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
              },
              content: comment.content,
              created_at: comment.created_at
            }));
          }
        },
        error: (err) => {
          console.error('Error fetching comments:', err);
        }
      });
    }
  }

  fetchUserRating(articleId: string, headers: HttpHeaders) {
    this.http.get<any>(`http://localhost:8000/api/ratings/${articleId}`, {headers})
      .subscribe({
        next: (response) => {
          if (response.success && response.rating) {
            this.userRating = response.rating;
            this.ratingMessage = 'Thanks for your rating!';
          } else {
            this.userRating = null;
            this.ratingMessage = 'Please rate this article';
          }
        },
        error: (err) => {
          console.error('Error fetching rating:', err);
        }
      });
  }

  setRating(rating: number) {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (!articleId) return;

    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(`http://localhost:8000/api/ratings/create`, {
      article_id: articleId,
      rating: rating
    }, { headers })
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.userRating = rating;
          this.ratingMessage = 'Thanks for your rating!';
          this.snackBar.open('Rating submitted successfully!', 'Close', {
            duration: 3000
          });
        }
      },
      error: (err) => {
        console.error('Error submitting rating:', err);
        this.snackBar.open('Failed to submit rating', 'Close', {
          duration: 3000
        });
      }
    });
  }

  onStarHover(rating: number | null) {
    this.hoverRating = rating;
  }

  getStarColor(starNumber: number): string {
    if (this.hoverRating !== null) {
      return starNumber <= this.hoverRating ? '#FFD700' : '#e0e0e0';
    }
    if (this.userRating !== null) {
      return starNumber <= this.userRating ? '#FFD700' : '#e0e0e0';
    }
    return '#e0e0e0';
  }

  openSummaryWithTyping(summaryText: string) {
    this.startTypingSummary(summaryText);
    this.openSummaryDialog();
  }

  startTypingSummary(summaryText: string) {
    this.animatedSummary = '';
    this.isTyping = true;
    let index = 0;
  
    const typingInterval = setInterval(() => {
      if (index < summaryText.length) {
        this.animatedSummary += summaryText.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
        this.isTyping = false;
      }
    }, 50);
  }
  
  openSummaryDialog() {
    this.dialog.open(this.summaryDialog, {
      width: '600px',
      maxHeight: '80vh'
    });
  }

  copySummary() {
    this.clipboard.copy(this.article.summary);
    this.snackBar.open('Summary copied to clipboard!', 'Close', {
      duration: 3000
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      const articleId = this.route.snapshot.paramMap.get('id');
      const token = localStorage.getItem('auth_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      const comment = {article_id: articleId, content: this.newComment}
      this.http.post<any>(`http://localhost:8000/api/comments/create`, {comment}, { headers })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.newComment='';
            this.snackBar.open('Your comment is posted', 'Close', {
              duration: 3000
            });
            this.ngOnInit();
          }
        },
        error: (err) => {
          console.error('Error posting comment:', err);
          this.snackBar.open('Failed to post comment', 'Close', {
            duration: 2000
          });
        }
      });
    }
  }
}