import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { AuthService } from '../../services/auth.service';

interface DestinationContent {
  id: string;
  title: string;
  imageUrl: string;
  imageFile?: File;
  shortDescription: string;
  fullDescription: string;
  location: string;
  hours: string;
  entranceFee: string;
  goodFor: string[];
  parking: string;
  contactNumber: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
  featured: boolean;
}

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.page.html',
  styleUrls: ['./destinations.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class DestinationsPage implements OnInit {
  // Permission flags
  canCreate: boolean = false;
  canUpdate: boolean = false;
  canDelete: boolean = false;
  
  // UI states
  isLoading: boolean = false;
  showContentModal: boolean = false;
  showDeleteConfirm: boolean = false;
  selectedContent: DestinationContent | null = null;
  isEditing: boolean = false;
  
  // Filters
  searchTerm: string = '';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  
  // Options for checkboxes and dropdowns
  goodForOptions: string[] = [
    'Adventure',
    'Family',
    'Romantic',
    'Friends',
    'Solo',
    'Culture',
    'Nature',
    'Relaxation',
    'Food',
    'Shopping',
    'History',
    'Education',
    'Photography',
    'Wellness'
  ];

  parkingOptions: string[] = [
    'Available',
    'Limited',
    'Street Parking',
    'Paid Parking',
    'Valet',
    'None'
  ];

  statusOptions: string[] = [
    'published',
    'draft'
  ];
  
  // Form data for new/edit content
  contentForm: any = {
    title: '',
    imageUrl: '',
    imageFile: undefined,
    shortDescription: '',
    fullDescription: '',
    location: '',
    hours: '',
    entranceFee: '',
    goodFor: [],
    parking: 'Available',
    contactNumber: '',
    website: '',
    status: 'published',
    featured: false
  };
  
  // Sample content data
  contents: DestinationContent[] = [
    {
      id: 'CONT001',
      title: 'Rainforest Park',
      imageUrl: 'assets/destinations/rainforest-park.jpg',
      shortDescription: 'RAVE (Rainforest Adventure Experience) Park is Pasig\'s urban oasis, offering 8 hectares of green space with adventure activities.',
      fullDescription: 'RAVE (Rainforest Adventure Experience) Park is Pasig\'s urban oasis, offering 8 hectares of green space with adventure activities, educational exhibits, and recreational facilities. Originally part of the Pasig Rainforest Park, it was revitalized as an eco-adventure destination in 2010. The park combines nature conservation with adventure tourism, featuring ziplines, rope courses, and wildlife exhibits within the city.',
      location: 'Caruncho Ave, Pasig City',
      hours: 'Open 8:00 AM - 6:00 PM daily',
      entranceFee: 'FREE (Some activities may have fees)',
      goodFor: ['Adventure', 'Family', 'Nature'],
      parking: 'Available',
      contactNumber: '(02) 1234-5678',
      website: 'www.rainforestpark.ph',
      createdAt: 'January 15, 2026',
      updatedAt: 'March 1, 2026',
      status: 'published',
      featured: true
    },
    {
      id: 'CONT002',
      title: 'Pasig Cathedral',
      imageUrl: 'assets/destinations/pasig-cathedral.jpg',
      shortDescription: 'Also known as the Immaculate Conception Parish, this historic church dates back to the Spanish colonial period.',
      fullDescription: 'Also known as the Immaculate Conception Parish, this historic church dates back to the Spanish colonial period. The cathedral features beautiful architecture and is a significant religious and cultural landmark in Pasig City. It has been a witness to the city\'s rich history and continues to serve as a place of worship and pilgrimage for many devotees.',
      location: 'Plaza Rizal, Pasig City',
      hours: 'Open 6:00 AM - 8:00 PM daily',
      entranceFee: 'FREE',
      goodFor: ['Culture', 'History', 'Religious'],
      parking: 'Limited',
      contactNumber: '(02) 2345-6789',
      website: 'www.pasigcathedral.ph',
      createdAt: 'January 20, 2026',
      updatedAt: 'February 28, 2026',
      status: 'published',
      featured: true
    },
    {
      id: 'CONT003',
      title: 'Pasig Museum',
      imageUrl: 'assets/destinations/pasig-museum.jpg',
      shortDescription: 'The Pasig City Museum is housed in a historic building that was once the residence of the city\'s gobernadorcillo.',
      fullDescription: 'The Pasig City Museum is housed in a historic building that was once the residence of the city\'s gobernadorcillo. It features exhibits on local history, culture, and art. Visitors can explore various artifacts, photographs, and documents that tell the story of Pasig\'s evolution from a small town to a bustling city.',
      location: 'Dr. Sixto Antonio Ave, Pasig City',
      hours: 'Open 9:00 AM - 5:00 PM (Closed Mondays)',
      entranceFee: '₱30',
      goodFor: ['Culture', 'History', 'Education'],
      parking: 'Street Parking',
      contactNumber: '(02) 3456-7890',
      website: 'www.pasigmuseum.ph',
      createdAt: 'February 5, 2026',
      updatedAt: 'February 5, 2026',
      status: 'draft',
      featured: false
    }
  ];

  // Filtered contents
  filteredContents: DestinationContent[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.filteredContents = [...this.contents];
    this.totalItems = this.contents.length;
  }

  ngOnInit() {
    this.setPermissions();
  }

  // ============= PERMISSION FUNCTIONS =============
  setPermissions() {
    this.canCreate = this.authService.hasAccess({ table: 'destinations', action: 'create' });
    this.canUpdate = this.authService.hasAccess({ table: 'destinations', action: 'update' });
    this.canDelete = this.authService.hasAccess({ table: 'destinations', action: 'delete' });
  }

  // ============= FILTER FUNCTIONS =============
  applyFilters() {
    let filtered = [...this.contents];
    
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(term) ||
        c.shortDescription.toLowerCase().includes(term) ||
        c.fullDescription.toLowerCase().includes(term) ||
        c.location.toLowerCase().includes(term)
      );
    }
    
    this.filteredContents = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  resetFilters() {
    this.searchTerm = '';
    this.filteredContents = [...this.contents];
    this.totalItems = this.contents.length;
    this.currentPage = 1;
  }

  // ============= IMAGE HANDLING =============
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.contentForm.imageFile = file;
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.contentForm.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.contentForm.imageUrl = '';
    this.contentForm.imageFile = undefined;
  }

  // ============= CHECKBOX HANDLERS =============
  toggleGoodFor(option: string) {
    if (!this.contentForm.goodFor) {
      this.contentForm.goodFor = [];
    }
    
    const index = this.contentForm.goodFor.indexOf(option);
    if (index === -1) {
      this.contentForm.goodFor.push(option);
    } else {
      this.contentForm.goodFor.splice(index, 1);
    }
  }

  // ============= CONTENT MANAGEMENT =============
  openCreateModal() {
    this.isEditing = false;
    this.selectedContent = null;
    this.contentForm = {
      title: '',
      imageUrl: '',
      imageFile: undefined,
      shortDescription: '',
      fullDescription: '',
      location: '',
      hours: '',
      entranceFee: '',
      goodFor: [],
      parking: 'Available',
      contactNumber: '',
      website: '',
      status: 'published',
      featured: false
    };
    this.showContentModal = true;
  }

  openEditModal(content: DestinationContent) {
    this.isEditing = true;
    this.selectedContent = content;
    this.contentForm = { ...content };
    this.showContentModal = true;
  }

  viewContent(content: DestinationContent) {
    this.selectedContent = content;
    this.isEditing = false;
    this.showContentModal = true;
  }

  closeModal() {
    this.showContentModal = false;
    this.selectedContent = null;
    this.isEditing = false;
  }

  // Save content
  saveContent() {
    this.isLoading = true;
    
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      
      if (this.isEditing && this.selectedContent) {
        // Update existing content
        const index = this.contents.findIndex(c => c.id === this.selectedContent!.id);
        if (index !== -1) {
          const updatedContent: DestinationContent = {
            ...this.selectedContent,
            title: this.contentForm.title,
            imageUrl: this.contentForm.imageUrl,
            shortDescription: this.contentForm.shortDescription,
            fullDescription: this.contentForm.fullDescription,
            location: this.contentForm.location,
            hours: this.contentForm.hours,
            entranceFee: this.contentForm.entranceFee,
            goodFor: this.contentForm.goodFor,
            parking: this.contentForm.parking,
            contactNumber: this.contentForm.contactNumber,
            website: this.contentForm.website,
            status: this.contentForm.status,
            featured: this.contentForm.featured,
            updatedAt: dateStr
          };
          this.contents[index] = updatedContent;
        }
      } else {
        // Create new content
        const newContent: DestinationContent = {
          id: 'CONT' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
          title: this.contentForm.title || 'Untitled',
          imageUrl: this.contentForm.imageUrl || 'assets/placeholder.jpg',
          shortDescription: this.contentForm.shortDescription || '',
          fullDescription: this.contentForm.fullDescription || '',
          location: this.contentForm.location || '',
          hours: this.contentForm.hours || 'Open daily',
          entranceFee: this.contentForm.entranceFee || 'FREE',
          goodFor: this.contentForm.goodFor || [],
          parking: this.contentForm.parking || 'Available',
          contactNumber: this.contentForm.contactNumber || '',
          website: this.contentForm.website || '',
          createdAt: dateStr,
          updatedAt: dateStr,
          status: this.contentForm.status || 'published',
          featured: this.contentForm.featured || false
        };
        
        this.contents.push(newContent);
      }
      
      // Refresh filtered list
      this.filteredContents = [...this.contents];
      this.totalItems = this.contents.length;
      
      this.isLoading = false;
      this.closeModal();
    }, 500);
  }

  // Delete content
  confirmDelete(content: DestinationContent) {
    this.selectedContent = content;
    this.showDeleteConfirm = true;
  }

  deleteContent() {
    if (!this.selectedContent) return;
    
    this.isLoading = true;
    
    setTimeout(() => {
      this.contents = this.contents.filter(c => c.id !== this.selectedContent!.id);
      this.filteredContents = [...this.contents];
      this.totalItems = this.contents.length;
      
      this.isLoading = false;
      this.showDeleteConfirm = false;
      this.selectedContent = null;
    }, 500);
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.selectedContent = null;
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
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  get paginatedContents(): DestinationContent[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredContents.slice(start, end);
  }

  // ============= STATISTICS FUNCTIONS =============
  getTotalPublished(): number {
    return this.contents.filter(c => c.status === 'published').length;
  }

  getTotalDraft(): number {
    return this.contents.filter(c => c.status === 'draft').length;
  }

  getTotalFeatured(): number {
    return this.contents.filter(c => c.featured).length;
  }

  // ============= NAVIGATION FUNCTIONS =============
  navigateTo(page: string) {
    const routes: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'bookings': '/tourguide',
      'feedback': '/feedback-ratings',
      'monitoring': '/monitoring',
      'number-of-tourist': '/number-of-tourist',
      'destinations': '/destinations'
    };
    this.router.navigate([routes[page]]);
  }

  // ============= LOGOUT FUNCTION =============
  logout() {
    this.authService.logout();
  }
}