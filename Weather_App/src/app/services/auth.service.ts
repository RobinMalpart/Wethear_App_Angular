import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signup(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, password }).pipe(
      map((response: any) => response.token),
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(() => new Error('An error occurred during signup'));
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      map((response: any) => {
        localStorage.setItem('authToken', response.token);
        return response.token;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('An error occurred during login'));
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }
}