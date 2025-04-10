import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../shared/models/category.model'; // Adjust path
import { CreateArticle } from '../../shared/models/articles.model';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
    token = localStorage.getItem('auth_token');
    headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    private apiUrl = 'http://localhost:8000/api/articles'; // replace with your API endpoint

  constructor(private http: HttpClient) {}

  createArticle(data: CreateArticle): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`,  data, {headers: this.headers});
  }

  getArticle(articleId: string): Observable<any> {
    return this.http.get(`http://localhost:8000/api/articles/${articleId}`, {headers: this.headers});
  }

  updateArticle(articleId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${articleId}`, data, {headers: this.headers});
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-image`, formData, {headers: this.headers});
  }

  generateArticleWithAI(image_url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, { image_url }, {headers: this.headers});
  }

}