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
    // Vérifie si l'utilisateur existe déjà
    return this.http.get<any[]>(`${this.apiUrl}/users?username=${username}`).pipe(
      map((users) => {
        if (users.length > 0) {
          throw new Error('Username already exists');
        } else {
          // Crée un nouvel utilisateur
          return this.http.post(`${this.apiUrl}/users`, {
            username,
            password
          }).subscribe(); // Inscription réussie
        }
      }),
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(() => new Error('An error occurred during signup'));
      })
    );
  }
  

  login(username: string, password: string): Observable<any> {
    // Requête pour trouver l'utilisateur correspondant
    return this.http.get<any[]>(`${this.apiUrl}/users?username=${username}`).pipe(
      map((users) => {
        if (users.length > 0 && users[0].password === password) {
          // Simuler la création d'un token
          const token = this.generateToken();

          // Ajouter le token dans la base de données
          this.http.post(`${this.apiUrl}/tokens`, {
            userId: users[0].id,
            token,
          }).subscribe();

          // Stocker le token dans localStorage
          localStorage.setItem('authToken', token);

          return { success: true, token };
        } else {
          throw new Error('Invalid username or password');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('An error occurred during login'));
      })
    );
  }

  isAuthenticated(): boolean {
    // Vérifie si un token est stocké dans le localStorage
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  private generateToken(): string {
    // Génère un token aléatoire
    return Math.random().toString(36).substr(2);
  }
}
