// header.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  searchForm!: FormGroup;
  value: string = 'Daily';

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      cityName: [''],
      unit: [false], // false for °C, true for °F
      timeOption: ['Daily']
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const cityName = this.searchForm.get('cityName')?.value.trim();
      if (!cityName) {
        // Optionally, display an error message to the user
        return;
      }
      const unit = this.searchForm.get('unit')?.value ? 'F' : 'C';
      const timeOption = this.searchForm.get('timeOption')?.value;

      // Navigate to /location with query parameters
      this.router.navigate(['/location'], {
        queryParams: {
          city: cityName,
          unit: unit,
          time: timeOption
        }
      }).catch(err => {
        // Handle navigation errors
        console.error('Navigation Error:', err);
      });

      // Optionally, reset the form or handle further logic
      // this.searchForm.reset({ unit: false, timeOption: 'Daily' });
    }
  }

  selectTimeOption(option: string): void {
    this.value = option;
    this.searchForm.get('timeOption')?.setValue(option);
    this.onSubmit();
  }
}
