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
}
