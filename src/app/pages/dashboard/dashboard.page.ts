import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class DashboardPage implements OnInit {
  userEmail: string = '';
  userRole: string = '';

  // Dashboard stats
  totalTourists: number = 12543;
  activeGuides: number = 87;
  totalBookings: number = 3247;
  mostVisited: string = 'Pasig River';
  mostVisitedCount: number = 2156;
  
  // Real-time monitoring data
  realTimeData = [
    { location: 'Pasig River Park', count: 125 },
    { location: 'Capitol Commons', count: 78 },
    { location: 'Rainforest Park', count: 45 }
  ];
  
  // Popular destinations
  popularDestinations = [
    { name: 'Pasig River Park', growth: '+15%', trend: 'up' },
    { name: 'Capitol Commons', growth: '+8%', trend: 'up' },
    { name: 'Rainforest Park', growth: '+12%', trend: 'up' },
    { name: 'Pasig Museum', growth: '-2%', trend: 'down' }
  ];

  // Peak hours data - same format as monitor page
  peakHours = [
    { hour: '8am - 10am', value: 45 },
    { hour: '10am - 12pm', value: 120 },
    { hour: '12pm - 2pm', value: 180 },
    { hour: '2pm - 4pm', value: 150 },
    { hour: '4pm - 6pm', value: 90 }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userEmail = this.authService.getEmail();
    this.userRole = this.authService.getRole();
  }

  viewMonitoring() {
    this.navigateTo('monitoring');
  }

  navigateTo(page: string) {
    const routes: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'bookings': '/tourguide',
      'feedback': '/feedback-ratings',
      'monitoring': '/monitoring',
      'number-of-tourist': '/number-of-tourist'
    };
    this.router.navigate([routes[page]]);
  }

  logout() {
    this.authService.logout();
  }
}