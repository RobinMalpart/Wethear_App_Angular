import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      switchMap((users) => {
        if (users.length > 0) {
          return throwError(() => new Error('Email already exists'));
        } else {
          return this.http.post(`${this.apiUrl}/users`, { email, password });
        }
      }),
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(() => new Error('An error occurred during signup'));
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length > 0) {
            const user = users[0];
            localStorage.setItem('authToken', user.id); // Stocker l'ID de l'utilisateur comme authToken
            return user.id;
          } else {
            throw new Error('Invalid credentials');
          }
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
