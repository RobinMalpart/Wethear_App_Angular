import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Location, UserHistory } from 'src/app/models/city';

@Injectable({
  providedIn: 'root',
})
export class JsonServerService {
  private locationApiUrl = 'http://localhost:3000/locations';
  private userHistoryApiUrl = 'http://localhost:3000/user_history';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  addLocation(ville: Location): Observable<Location> {
    return this.http
      .post<Location>(this.locationApiUrl, ville, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addSearch(search: UserHistory): Observable<UserHistory> {
    return this.http
      .post<UserHistory>(this.userHistoryApiUrl, search, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  addLocationAndSearch(
    userId: string,
    villeName: string,
    coordinateX: number,
    coordinateY: number
  ): Observable<{ ville: Location; search: UserHistory }> {
    return this.http
      .get<Location[]>(this.locationApiUrl, this.httpOptions)
      .pipe(
        switchMap((locations: Location[]) => {
          const existingLocation = locations.find(
            (loc) =>
              loc.name === villeName &&
              loc.coordinateX === coordinateX &&
              loc.coordinateY === coordinateY
          );
  
          if (existingLocation) {
            const newSearch: any = {
              id: uuidv4(),
              user_id: userId,
              location_id: existingLocation.id,
              consulted_at: new Date().toISOString(),
            };
            return this.addSearch(newSearch).pipe(
              switchMap((createdSearch: UserHistory) => {
                return new Observable<{ ville: Location; search: UserHistory }>(
                  (observer) => {
                    observer.next({ ville: existingLocation, search: createdSearch });
                    observer.complete();
                  }
                );
              })
            );
          } else {
            const newVille: any = {
              id: uuidv4(),
              city_name: villeName,
              latitude: coordinateX,
              longitude: coordinateY,
            };
  
            return this.addLocation(newVille).pipe(
              switchMap((createdVille: Location) => {
                const newSearch: any = {
                  id: uuidv4(),
                  user_id: userId,
                  location_id: createdVille.id,
                  consulted_at: new Date().toISOString(),
                };
                return this.addSearch(newSearch).pipe(
                  switchMap((createdSearch: UserHistory) => {
                    return new Observable<{ ville: Location; search: UserHistory }>(
                      (observer) => {
                        observer.next({ ville: createdVille, search: createdSearch });
                        observer.complete();
                      }
                    );
                  })
                );
              })
            );
          }
        }),
        catchError(this.handleError)
      );
  }
  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `A client-side error occurred: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${
        error.status
      }, body was: ${JSON.stringify(error.error)}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
