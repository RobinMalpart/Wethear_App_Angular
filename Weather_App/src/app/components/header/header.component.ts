import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  weatherData: any;
  searchForm: FormGroup;
  value: string = 'Daily';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.searchForm = this.fb.group({
      cityName: [''],
      timeOption: ['Daily'],
    });

    this.searchForm.get('timeOption')?.valueChanges.subscribe((val) => {
      this.value = val;
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
