import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private errorMessageSource = new BehaviorSubject<string | null>(null);

  errorMessage$ = this.errorMessageSource.asObservable();

  constructor() { }

  setErrorMessage(message: string | null) {
    this.errorMessageSource.next(message);
  }
}
