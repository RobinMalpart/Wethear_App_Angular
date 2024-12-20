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
          console.log('favorites', favorites);
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
    console.log('FaroviteService removeFavorite');
    console.log('userId', userId);
    console.log('locationId', locationId);
    return new Observable(observer => {
      this.http.delete(`http://localhost:3000/user_favorites/${userId}/${locationId}`).subscribe(
        data => {
          observer.next(data);
          observer.complete();
        },
        error => observer.error(error)
      );
    }
    );
  }
}