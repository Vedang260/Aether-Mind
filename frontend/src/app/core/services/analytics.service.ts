import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
    token = localStorage.getItem('auth_token');
    headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    private apiUrl = 'http://localhost:8000/api/analytics/categorywise-analytics'; // replace with your API endpoint

  constructor(private http: HttpClient) {}

  getDashboardAnalytics(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {headers: this.headers});
  }
}
