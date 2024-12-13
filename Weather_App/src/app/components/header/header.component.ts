// header.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  weatherData: any;
  searchForm: FormGroup;
  value: string = 'Daily';

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.searchForm = this.fb.group({
      cityName: [''],
      timeOption: ['Daily']
    });

    this.searchForm.get('timeOption')?.valueChanges.subscribe(val => {
      this.value = val;
    });
  }

  // onSubmit(): void {
  //   const cityName = this.searchForm.get('cityName')?.value;
  //   this.router.navigate(['/city', cityName]);
  // }
}