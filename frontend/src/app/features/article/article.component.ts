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

  constructor(
    private http: HttpClient, // ✅ Inject HttpClient
    private route: ActivatedRoute, // ✅ Inject ActivatedRoute to get ID
    private dialog: MatDialog,
    private clipboard: Clipboard,
    private snackBar: MatSnackBar
) {}
//   article = {
//     id: 1,
//     title: 'The Future of Knowledge Management in the AI Era',
//     image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
//     quote: "Knowledge management isn't just about storing information—it's about making it accessible and actionable.",
//     category: 'Future Trends',
//     readingTime: 8,
//     publishedDate: new Date('2023-05-15'),
//     introduction: `
//       In today's rapidly evolving digital landscape, the way we manage and interact with knowledge is undergoing a profound transformation. 
//       The integration of artificial intelligence into knowledge management systems is not just an incremental improvement—it's revolutionizing 
//       how organizations capture, organize, and leverage their collective intelligence.
//       This article explores the cutting-edge developments in AI-powered knowledge management and what they mean for businesses and individuals alike.</p>
//     `,
//     content: `
//       <h3>The AI Revolution in Knowledge Management</h3>
//       <p>Traditional knowledge management systems have often struggled with information overload, making it difficult for users to find exactly what 
//       they need when they need it. AI changes this paradigm by introducing intelligent search capabilities that understand context, intent, and even 
//       the searcher's role within an organization.</p>
      
//       <h3>Key Benefits of AI-Powered Systems</h3>
//       <p>Modern AI-driven knowledge management platforms offer several advantages:</p>
//       <ul>
//         <li><strong>Contextual Understanding:</strong> AI can interpret queries in natural language and provide precise answers rather than just document links.</li>
//         <li><strong>Personalization:</strong> Systems learn individual preferences and work patterns to surface the most relevant information.</li>
//         <li><strong>Automated Organization:</strong> AI can automatically categorize and tag content, reducing manual maintenance.</li>
//         <li><strong>Knowledge Gap Identification:</strong> By analyzing usage patterns, AI can highlight areas where documentation is lacking.</li>
//       </ul>
      
//       <h3>Real-World Applications</h3>
//       <p>Several forward-thinking companies are already seeing remarkable results:</p>
//       <p>A major tech company reduced its average problem resolution time by 40% after implementing an AI knowledge system that surfaces relevant 
//       troubleshooting guides based on error codes and technician notes.</p>
//     `,
//     didYouKnow: `
//       <p>The concept of "knowledge management" dates back to the 1980s, but it wasn't until the late 1990s that it became a recognized discipline. 
//       The rise of the internet and digital documentation created both the need and the means for systematic knowledge management.</p>
//       <p>Today, the global knowledge management market is projected to reach $1.1 trillion by 2026, driven largely by AI adoption.</p>
//     `,
//     conclusion: `
//       <p>As we look to the future, it's clear that AI will continue to transform knowledge management from a static repository of information into 
//       a dynamic, intelligent system that actively supports decision-making and problem-solving.</p>
//       <p>Organizations that embrace these technologies early will gain significant competitive advantages through improved efficiency, faster 
//       onboarding, and better retention of institutional knowledge.</p>
//     `,
//     tags: ['AI', 'Knowledge Management', 'Future Trends', 'Technology'],
//     author: {
//       name: 'Dr. Emily Chen',
//       avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
//       bio: 'Dr. Chen is a leading researcher in knowledge management systems and AI applications. She has published over 50 papers on the subject and advises Fortune 500 companies on digital transformation.'
//     }
//   };

  comments = [
    {
      user: {
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      date: new Date('2023-05-16'),
      text: 'Great article! We implemented an AI knowledge system last year and saw a 30% reduction in support ticket resolution time.'
    },
    {
      user: {
        name: 'Sarah Williams',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      date: new Date('2023-05-18'),
      text: 'The point about automated organization is so true. We spent countless hours manually tagging content before switching to an AI system.'
    }
  ];

  newComment = '';
  isLongArticle = true;
  aiSummary = `This article explores how AI is transforming knowledge management by introducing intelligent search, personalization, and automated organization. It highlights key benefits like contextual understanding and knowledge gap identification, with real-world examples showing significant efficiency gains. The conclusion emphasizes that early adopters of AI-powered knowledge systems will gain competitive advantages through improved decision-making and institutional knowledge retention.`;

  ngOnInit(): void {
    // In a real app, you would fetch the article data based on ID from a service
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
        const token = localStorage.getItem('auth_token');
        const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
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
      }
}

  openSummaryDialog() {
    this.dialog.open(this.summaryDialog, {
      width: '600px',
      maxHeight: '80vh'
    });
  }

  copySummary() {
    this.clipboard.copy(this.aiSummary);
    this.snackBar.open('Summary copied to clipboard!', 'Close', {
      duration: 3000
    });
  }

  addComment() {
    if (this.newComment.trim()) {
      this.comments.unshift({
        user: {
          name: 'Current User',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        date: new Date(),
        text: this.newComment
      });
      this.newComment = '';
      this.snackBar.open('Comment posted!', 'Close', {
        duration: 2000
      });
    }
  }
}