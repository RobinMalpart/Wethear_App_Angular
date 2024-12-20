import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JsonServerService } from '../jsonServer/jsonServer.service';

@Injectable({
  providedIn: 'root'
})
  
export class CityService {

  constructor(private http: HttpClient, private jsonService: JsonServerService) { }

  getCityFromId(id: string): Observable<any> {
    console.log('id',id);
    return new Observable(observer => {
      this.http.get<any>('http://localhost:3000/locations').subscribe(
        data => {
          if (data.length === 0) {
            observer.error('City not found');
          }
          const city = (data as any).filter((city: any) => city.id === id);
          observer.next(city);
          observer.complete();
        },
        error => observer.error(error)
      );
    }
    );
  }
}
