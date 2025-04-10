import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsersResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
    token = localStorage.getItem('auth_token');
    headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    private apiUrl = 'http://localhost:8000/api/users'; // replace with your API endpoint

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(this.apiUrl, {headers: this.headers});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {headers: this.headers});
  }
}
