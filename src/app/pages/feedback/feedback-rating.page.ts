import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-feedback-ratings',
  templateUrl: './feedback-rating.page.html',
  styleUrls: ['./feedback-rating.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class FeedbackRatingsPage {
   activePage: string = 'feedback';
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

  popularSpots = [
    { rank: 1, name: 'Capitol Commons', rating: 4.9, reviews: 324, satisfaction: 98 },
    { rank: 2, name: 'Rainforest Park', rating: 4.8, reviews: 487, satisfaction: 95 },
    { rank: 3, name: 'Pasig Museum', rating: 4.7, reviews: 298, satisfaction: 94 },
    { rank: 4, name: 'Pasig Cathedral', rating: 4.6, reviews: 256, satisfaction: 92 },
    { rank: 5, name: 'Ace Water Spa', rating: 4.5, reviews: 198, satisfaction: 90 }
  ];

  reviews = [
    {
      id: '#R2024001',
      name: 'Irene Guevarra',
      destination: 'Rainforest Park',
      rating: 5.0,
      comment: 'Amazing experience! The guide was very knowledgeable.',
      date: 'Dec 15, 2023',
      status: 'Published'
    },
    {
      id: '#R2024002',
      name: 'Ramil Manandeg',
      destination: 'Pasig Museum',
      rating: 4.0,
      comment: 'Great tour guide and locations. Would recommend.',
      date: 'Dec 14, 2023',
      status: 'Published'
    },
    {
      id: '#R2024003',
      name: 'Sarah Johnson',
      destination: 'Capitol Commons',
      rating: 5.0,
      comment: 'Beautiful place! Very clean and organized.',
      date: 'Dec 12, 2023',
      status: 'Pending'
    }
  ];
}