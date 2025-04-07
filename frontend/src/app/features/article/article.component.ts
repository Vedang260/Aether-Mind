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
    MatIconModule,          // Correct import for mat-icon
    MatButtonModule,         // Needed for buttons
    MatInputModule,         // Needed for matInput
    MatDialogModule,        // Needed for dialog
    MatSnackBarModule,      // Needed for snackbar
    FormsModule 
  ],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  @ViewChild('summaryDialog') summaryDialog!: TemplateRef<any>;
  article: any = {};
  loading: boolean = true;
  comments : any[] = [];

  constructor(
    private http: HttpClient, // ✅ Inject HttpClient
    private route: ActivatedRoute, // ✅ Inject ActivatedRoute to get ID
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
) {}

  newComment = '';
  isLongArticle = true;
  animatedSummary: string = '';
  isTyping: boolean = false;
  ngOnInit(): void {
    // In a real app, you would fetch the article data based on ID from a service
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
        });

        // fetching the articles
        this.http.get<any>(`http://localhost:8000/api/articles/${articleId}`, {headers})
          .subscribe({
            next: (response) => {
              this.article = response.article;
              this.loading = false;
            },
            error: (error) => {
              console.error('Error fetching article:', error);
              this.loading = false;
            }
        });

        // fetching the Comments
        this.http.get<any>(`http://localhost:8000/api/comments/${articleId}`, {headers}).subscribe({
            next: (response) => {
              if (response.success) {
                this.comments = response.comments.map((comment: any) => ({
                  user: {
                    name: comment.user.username,
                    avatar: 'https://randomuser.me/api/portraits/men/32.jpg' // You can improve this later
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

openSummaryWithTyping(summaryText: string) {
    this.startTypingSummary(summaryText); // Start the typing effect
    this.openSummaryDialog(); // Open the dialog
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
    }, 50); // typing speed in ms
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
        const comment = {articleId, content: this.newComment}
        this.http.post<any>(`http://localhost:8000/api/comments/create`, comment, { headers })
        .subscribe({
          next: (response) => {
            if (response.success) {
              // Add the new comment to the top of the list
              this.comments.unshift({
                user: {
                  name: response.comment.user.username, // ✅ Take from response
                  avatar: 'https://randomuser.me/api/portraits/men/1.jpg' // Later you can make this dynamic
                },
                content: response.comment.content,
                created_at: response.comment.created_at
              });
              this.newComment = '';
              this.snackBar.open('Comment posted!', 'Close', {
                duration: 2000
              });
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