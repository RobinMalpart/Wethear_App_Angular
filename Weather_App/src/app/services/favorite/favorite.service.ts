import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
 
  constructor(private http: HttpClient) { }

  getFavorites() {
    return new Observable(observer => {
      this.http.get('http://localhost:3000/user_favorites').subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => observer.error(error)
      );
    }
    );
  }

  addFavorite(userId: string, cityId: string) {
    return new Observable(observer => {
      this.http.post('http://localhost:3000/user_favorites', { user_id: userId, location_id: cityId }).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => observer.error(error)
      );
    });
  }

  getFavoritesByUserId(userId: string): Observable<any[]> {
    return new Observable(observer => {
      this.getFavorites().subscribe(
        (favorites: any) => {
          const filteredFavorites = favorites.filter((favorite: any) => favorite.user_id === userId);
          observer.next(filteredFavorites);
          observer.complete();
        },
        error => {
          console.error('Error in getFavoritesByUserId:', error);
          observer.error(error);
        }
      );
    });
  }


  removeFavorite(userId: string, locationId: string): Observable<any> {
    return new Observable(observer => {
      // Adjust URL to match JSON Server's expected structure
      this.http
        .get('http://localhost:3000/user_favorites')
        .subscribe((favorites: any) => {
          const favorite = favorites.find(
            (fav: any) =>
              fav.user_id === userId && fav.location_id === locationId
          );
  
          if (favorite && favorite.id) {
            this.http
              .delete(`http://localhost:3000/user_favorites/${favorite.id}`)
              .subscribe(
                (data) => {
                  observer.next(data);
                  observer.complete();
                },
                (error) => observer.error(error)
              );
          } else {
            console.error('Favorite not found for deletion');
            observer.error(new Error('Favorite not found'));
          }
        });
    });
  }  
}