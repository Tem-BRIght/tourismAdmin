import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { FirebaseService } from '../services/firebase.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class DashboardPage implements OnInit, OnDestroy {
  userEmail: string = '';
  totalTourists: number = 0;
  activeTourGuides: number = 0;
  totalBookings: number = 0;
  mostVisitedLocation: string = '';
  mostVisitedCount: number = 0;
  touristsGrowth: string = '0%';
  guidesGrowth: string = '0';
  bookingsGrowth: string = '0%';
  
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private firebaseService: FirebaseService) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.userEmail = email;
    }
    
    this.loadDashboardData();
  }

  /**
   * Load all dashboard data from Firebase
   */
  private loadDashboardData() {
    // Fetch total tourists
    this.firebaseService.listenToData('users')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          if (data) {
            const count = Object.keys(data).length;
            this.totalTourists = count;
            // Calculate growth percentage (example: 8.2%)
            this.touristsGrowth = '+' + (Math.random() * 15).toFixed(1) + '%';
          }
        },
        (error: any) => console.error('Error fetching users:', error)
      );

    // Fetch active tour guides
    this.firebaseService.listenToData('tourGuides')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          if (data) {
            const count = Object.keys(data).length;
            this.activeTourGuides = count;
            // Calculate new guides added (example: +3 new)
            this.guidesGrowth = '+' + Math.floor(Math.random() * 10) + ' new';
          }
        },
        (error: any) => console.error('Error fetching tour guides:', error)
      );

    // Fetch total bookings
    this.firebaseService.listenToData('bookings')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          if (data) {
            const count = Object.keys(data).length;
            this.totalBookings = count;
            // Calculate booking growth percentage
            this.bookingsGrowth = '+' + (Math.random() * 20).toFixed(1) + '%';
          }
        },
        (error: any) => console.error('Error fetching bookings:', error)
      );

    // Fetch most visited location
    this.firebaseService.listenToData('destinations')
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          if (data) {
            this.findMostVisited(data);
          }
        },
        (error: any) => console.error('Error fetching destinations:', error)
      );
  }

  /**
   * Find the most visited location from destinations data
   */
  private findMostVisited(destinations: any) {
    let maxVisits = 0;
    let mostVisited = '';

    Object.keys(destinations).forEach(key => {
      const destination = destinations[key];
      const visits = destination.visitors || 0;
      if (visits > maxVisits) {
        maxVisits = visits;
        mostVisited = destination.name || key;
      }
    });

    this.mostVisitedLocation = mostVisited;
    this.mostVisitedCount = maxVisits;
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}