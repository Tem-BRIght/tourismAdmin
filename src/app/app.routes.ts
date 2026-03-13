import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then(m => m.DashboardPage)
  },
  {
    path: 'tourguide',
    loadComponent: () => import('./tourguide/tour-guide-page').then(m => m.TourGuidePage)
  },
  {
    path: 'feedback-ratings',
    loadComponent: () => import('./feedback/feedback-rating.page').then(m => m.FeedbackRatingsPage)
  },
  {
    path: 'monitoring',
    loadComponent: () => import('./monitor/monitor-activity.page').then(m => m.MonitorActivityPage)
  },
  {
    path: 'number-of-tourist',
    loadComponent: () => import('./numoftourist/number-of-tourist.page').then(m => m.NumberOfTouristPage)
  }
];