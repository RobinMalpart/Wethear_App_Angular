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
            console.log(users);
            const user = users[0];
            localStorage.setItem('userId', user.id);
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
    const userId = localStorage.getItem('userId');
    return !!userId;
  }
  
  getUser(): string | null {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.warn('No userId found in localStorage');
      return null;
    }
    return userId;
  }

  logout(): void {
    localStorage.removeItem('userId');
  }
}
