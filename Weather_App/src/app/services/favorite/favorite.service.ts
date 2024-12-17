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
}
