import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../shared/models/category.model'; // Adjust path

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
    token = localStorage.getItem('auth_token');
    headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    private apiUrl = 'http://localhost:8000/api/category'; // replace with your API endpoint

  constructor(private http: HttpClient) {}

  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(this.apiUrl, {headers: this.headers});
  }

  createCategory(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, data, {headers: this.headers});
  }

  updateCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data, {headers: this.headers});
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: this.headers});
  }
}
