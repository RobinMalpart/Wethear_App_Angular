import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MessageService } from 'src/app/services/message/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  searchForm!: FormGroup;
  value: string = 'Daily';
  errorMessage: string | null = null;

  isAuthenticated: boolean = false;
  private authSubscription!: Subscription;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      cityName: ['', Validators.required], 
      unit: [false],
      timeOption: ['Daily'],
    });

    this.messageService.errorMessage$.subscribe(message => {
      this.errorMessage = message;
    });

    this.authSubscription = this.authService.userId$.subscribe((userId) => {
      this.isAuthenticated = !!userId;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const cityName = this.searchForm.get('cityName')?.value.trim();
      const unit = this.searchForm.get('unit')?.value ? 'F' : 'C';
      const timeOption = this.searchForm.get('timeOption')?.value;

      this.router
        .navigate(['/location'], {
          queryParams: {
            city: cityName,
            unit: unit,
            time: timeOption,
          },
        })
        .catch((err) => {
          console.error('Navigation Error:', err);
        });

      this.errorMessage = null;
      this.messageService.setErrorMessage(null);
    } else {
      this.messageService.setErrorMessage('Please enter a valid city name.');
    }
  }

  selectTimeOption(option: string): void {
    this.value = option;
    this.searchForm.get('timeOption')?.setValue(option);
    this.onSubmit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }
}
