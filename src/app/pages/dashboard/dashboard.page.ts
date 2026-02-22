import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class DashboardPage implements OnInit {
  userEmail: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.userEmail = email;
    }
  }

  navigateTo(page: string) {
    const routes: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'bookings': '/tourguide',
      'feedback': '/feedback-ratings',
      'monitoring': '/monitoring',
      'number-of-tourist': '/number-of-tourist'
    };

    const route = routes[page];
    if (route) {
      this.router.navigate([route]);
    }
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}