import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { username, password } = this.signupForm.value;
      this.authService.signup(username, password).subscribe(
        (response) => {
          console.log('Signup successful:', response);
          // Redirection ou affichage d’un message de succès
        },
        (error) => {
          console.error('Signup failed:', error);
          // Afficher un message d’erreur
        }
      );
    }
  }
}
