import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

interface Feedback {
  id: string;
  name: string;
  destination: string;
  rating: number;
  comment: string;
  date: string;
  destinationImage?: string;
}

interface PopularSpot {
  rank: number;
  name: string;
  rating: number;
  reviews: number;
  satisfaction: number;
}

@Component({
  selector: 'app-feedback-ratings',
  templateUrl: './feedback-rating.page.html',
  styleUrls: ['./feedback-rating.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class FeedbackRatingsPage implements OnInit {
  // Permission flags
  canReadFeedback: boolean = false;
  canDeleteFeedback: boolean = false;
  
  // UI states
  isLoading: boolean = false;
  showFeedbackModal: boolean = false;
  selectedFeedback: Feedback | null = null;
  
  // Filters - Removed status filter
  filterDestination: string = '';
  filterRating: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 100;
  
  // Summary statistics
  overallRating: number = 4.8;
  totalReviews: number = 2847;
  topRatedDestination: string = 'Capitol Commons';
  topRatedScore: number = 4.9;
  mostReviewedSpot: string = 'Rainforest Park';
  mostReviewedCount: number = 487;
  satisfactionRate: number = 92;
  satisfactionGrowth: number = 3.2;
  
  // Data arrays
  popularSpots: PopularSpot[] = [
    { rank: 1, name: 'Capitol Commons', rating: 4.9, reviews: 324, satisfaction: 98 },
    { rank: 2, name: 'Rainforest Park', rating: 4.8, reviews: 487, satisfaction: 95 },
    { rank: 3, name: 'Pasig Museum', rating: 4.7, reviews: 298, satisfaction: 94 },
    { rank: 4, name: 'Pasig Cathedral', rating: 4.6, reviews: 256, satisfaction: 92 },
    { rank: 5, name: 'Ace Water Spa', rating: 4.5, reviews: 198, satisfaction: 90 }
  ];

  // Feedback data - Removed status
  reviews: Feedback[] = [
    {
      id: '#R2024001',
      name: 'Irene Guevarra',
      destination: 'Rainforest Park',
      rating: 5.0,
      comment: 'Amazing experience! The guide was very knowledgeable. The park is well-maintained and the tour was educational.',
      date: 'Dec 15, 2023',
      destinationImage: 'rainforest-park.jpg'
    },
    {
      id: '#R2024002',
      name: 'Ramil Manandeg',
      destination: 'Pasig Museum',
      rating: 4.0,
      comment: 'Great tour guide and locations. Would recommend. The exhibits are fascinating and well-organized.',
      date: 'Dec 14, 2023',
      destinationImage: 'pasig-museum.jpg'
    },
    {
      id: '#R2024003',
      name: 'Sarah Johnson',
      destination: 'Capitol Commons',
      rating: 5.0,
      comment: 'Beautiful place! Very clean and organized. Perfect for families and friends to hang out.',
      date: 'Dec 12, 2023',
      destinationImage: 'capitol-commons.jpg'
    },
    {
      id: '#R2024004',
      name: 'Michael Tan',
      destination: 'Ace Water Spa',
      rating: 4.5,
      comment: 'Relaxing and clean. Will come back. The facilities are top-notch.',
      date: 'Dec 10, 2023',
      destinationImage: 'ace-water-spa.jpg'
    },
    {
      id: '#R2024005',
      name: 'Lisa Wong',
      destination: 'Pasig Cathedral',
      rating: 4.8,
      comment: 'Beautiful architecture and peaceful atmosphere. A must-visit for history lovers.',
      date: 'Dec 8, 2023',
      destinationImage: 'pasig-cathedral.jpg'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.setPermissions();
  }

  // ============= PERMISSION FUNCTIONS =============
  setPermissions() {
    this.canReadFeedback = this.authService.hasAccess({ table: 'feedback', action: 'read' });
    this.canDeleteFeedback = this.authService.isSuperAdmin();
  }

  // ============= FEEDBACK MANAGEMENT FUNCTIONS =============
  viewFeedback(feedback: Feedback) {
    if (this.canReadFeedback) {
      this.selectedFeedback = feedback;
      this.showFeedbackModal = true;
    }
  }

  closeModal() {
    this.showFeedbackModal = false;
    this.selectedFeedback = null;
  }

  deleteFeedback(feedbackId: string | undefined) {
    if (!feedbackId) return;
    
    if (this.canDeleteFeedback && confirm('Are you sure you want to delete this feedback?')) {
      this.isLoading = true;
      setTimeout(() => {
        this.reviews = this.reviews.filter(f => f.id !== feedbackId);
        this.isLoading = false;
        this.closeModal();
      }, 500);
    }
  }

  // ============= FILTER FUNCTIONS =============
  applyFilters() {
    console.log('Applying filters:', {
      destination: this.filterDestination,
      rating: this.filterRating
    });
    this.currentPage = 1;
  }

  resetFilters() {
    this.filterDestination = '';
    this.filterRating = '';
    this.applyFilters();
  }

  // ============= EXPORT FUNCTION =============
  exportData() {
    if (this.canReadFeedback) {
      console.log('Exporting feedback data...');
      this.generateCSV();
    }
  }

  generateCSV() {
    const headers = ['ID', 'Tourist', 'Destination', 'Date', 'Rating', 'Comment'];
    const csvContent = this.reviews.map(f => 
      [f.id, f.name, f.destination, f.date, f.rating, f.comment].join(',')
    );
    csvContent.unshift(headers.join(','));
    
    const blob = new Blob([csvContent.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  // ============= PAGINATION FUNCTIONS =============
  changePage(page: number) {
    this.currentPage = page;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getPageArray(): number[] {
    const pages = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 4);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get paginatedReviews(): Feedback[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.reviews.slice(start, end);
  }

  // ============= STATISTICS FUNCTIONS =============
  getAverageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, f) => acc + f.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }

  // ============= NAVIGATION FUNCTIONS =============
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

  // ============= LOGOUT FUNCTION =============
  logout() {
    this.authService.logout();
  }
}