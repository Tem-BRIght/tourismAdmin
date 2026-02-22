import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-monitor-activity',
  templateUrl: './monitor-activity.page.html',
  styleUrls: ['./monitor-activity.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class MonitorActivityPage {
  activePage: string = 'monitoring';
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

  stats = [
    { label: 'Active Tours Now', value: 24, change: '+3', icon: '🚌' },
    { label: 'Tourists On-site', value: 187, change: '+12', icon: '👥' },
    { label: 'Guides On Duty', value: 12, change: '+2', icon: '🎯' },
    { label: 'Ongoing Bookings', value: 8, change: '+1', icon: '📋' }
  ];

  currentTours = [
    { id: 'TUR-001', destination: 'Pasig Museum', guide: 'Bernard Panlilio', size: 8, status: 'Active', progress: 65 },
    { id: 'TUR-002', destination: 'Rainforest Park', guide: 'Irene Guevarra', size: 12, status: 'Paused', progress: 45 },
    { id: 'TUR-003', destination: 'Ace Water Spa', guide: 'Ramil Manandeg', size: 6, status: 'Active', progress: 80 },
    { id: 'TUR-004', destination: 'Capitol Commons', guide: 'Mike Rodriguez', size: 15, status: 'Active', progress: 30 },
    { id: 'TUR-005', destination: 'Pasig Cathedral', guide: 'Emma Wilson', size: 10, status: 'Completed', progress: 100 }
  ];

  activities = [
    { title: 'Tourist checked in at Rainforest Park', time: '2 minutes ago', type: 'Check-in', icon: '✅' },
    { title: 'Tour started at Pasig Museum', time: '5 minutes ago', type: 'Started', icon: '▶️' },
    { title: 'Guide assigned to Capitol Commons', time: '8 minutes ago', type: 'Assignment', icon: '👤' },
    { title: 'Tour completed at Ace Water Spa', time: '15 minutes ago', type: 'Completed', icon: '🏁' },
    { title: 'New booking for Pasig Cathedral', time: '22 minutes ago', type: 'Booking', icon: '📅' },
    { title: 'Tourist feedback submitted', time: '30 minutes ago', type: 'Feedback', icon: '💬' }
  ];
}