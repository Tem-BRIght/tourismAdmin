import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonCheckbox, IonButton, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    
    // Validate inputs
    if (!this.email || !this.password) {
      alert('Please fill in all fields');
      this.isLoading = false;
      return;
    }

    // Simulate authentication delay
    setTimeout(() => {
      // Store authentication token/user info if needed
      if (this.rememberMe) {
        localStorage.setItem('userEmail', this.email);
      }
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
      this.isLoading = false;
    }, 500);
  }

}