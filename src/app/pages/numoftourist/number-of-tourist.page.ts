import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-number-of-tourist',
  templateUrl: './number-of-tourist.page.html',
  styleUrls: ['./number-of-tourist.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class NumberOfTouristPage {
  activePage: string = 'number-of-tourist';
  constructor(private router: Router) {}

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

  heatmap = Array(28).fill(0).map((_, i) => ({
    value: Math.floor(Math.random() * 100),
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    hour: Math.floor(i / 4) * 2 + 8
  }));

  monthlyData = [
    { month: 'Jan', tourists: 1250, tours: 45 },
    { month: 'Feb', tourists: 1450, tours: 52 },
    { month: 'Mar', tourists: 1850, tours: 68 },
    { month: 'Apr', tourists: 2100, tours: 75 },
    { month: 'May', tourists: 2450, tours: 82 },
    { month: 'Jun', tourists: 2800, tours: 95 }
  ];

  topDestinations = [
    { name: 'Rainforest Park', tourists: 3240, tours: 98, growth: '+15%' },
    { name: 'Pasig Museum', tourists: 2870, tours: 87, growth: '+12%' },
    { name: 'Capitol Commons', tourists: 2560, tours: 76, growth: '+8%' },
    { name: 'Pasig Cathedral', tourists: 1980, tours: 65, growth: '+5%' },
    { name: 'Ace Water Spa', tourists: 1650, tours: 54, growth: '+10%' }
  ];
}