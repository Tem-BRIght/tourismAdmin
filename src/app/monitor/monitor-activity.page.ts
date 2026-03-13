import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { FirebaseService } from '../services/firebase.service';

// ── Leaflet default-icon fix ──
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

// ── Interfaces ────────────────────────────────────────────────────
export interface InfoBlock {
  title: string;
  type: 'none' | 'bullet' | 'check';
  items: string[];
  plainText: string;
}

export interface DestinationLocation {
  lat: number;
  lng: number;
  xPercent: number;
  yPercent: number;
}

export interface NewDestination {
  name: string;
  description: string;
  imagePreview: string | null;
  imageFile: File | null;
  infoBlocks: InfoBlock[];
  location: DestinationLocation | null;
  address: string;
}

export interface Destination extends NewDestination {
  id: string;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface Stat {
  label: string;
  value: number;
  change: string;
  icon: string;
}

export interface Tour {
  id: string;
  destination: string;
  guide: string;
  size: number;
  status: string;
  progress: number;
}

export interface Activity {
  title: string;
  time: string;
  type: string;
  icon: string;
}

@Component({
  selector: 'app-monitor-activity',
  templateUrl: './monitor-activity.page.html',
  styleUrls: ['./monitor-activity.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class MonitorActivityPage implements OnInit, OnDestroy {
  activePage: string = 'monitoring';
  showAddDestinationModal = false;
  isSaving = false;

  @ViewChild('imageInput') imageInputRef!: ElementRef<HTMLInputElement>;

  newDestination: NewDestination = this.getEmptyDestination();

  // Firebase data
  destinations: Destination[] = [];
  stats: Stat[] = [];
  currentTours: Tour[] = [];
  activities: Activity[] = [];

  // Leaflet
  map: L.Map | null = null;
  marker: L.Marker | null = null;

  private unsubs: Array<() => void> = [];

  constructor(
    private router: Router,
    private firebaseSvc: FirebaseService
  ) {}

  ngOnInit() {
    // Subscribe to all real-time data
    this.subscribeToDestinations();
    this.subscribeToStats();
    this.subscribeToCurrentTours();
    this.subscribeToActivities();
  }

  ngOnDestroy() {
    this.unsubs.forEach(fn => fn());
  }

  // ── Firebase subscriptions ────────────────────────────────────────

  private subscribeToDestinations() {
    const unsub = this.firebaseSvc.onValue('destinations', (val) => {
      console.log('📍 Destinations from Firebase:', val);
      if (val) {
        this.destinations = Object.keys(val).map(key => ({
          id: key,
          ...val[key]
        }));
      } else {
        this.destinations = [];
      }
    });
    this.unsubs.push(unsub);
  }

  private subscribeToStats() {
    const unsub = this.firebaseSvc.onValue('monitor/stats', (val) => {
      console.log('📊 Stats from Firebase:', val);
      if (val) {
        this.stats = Object.values(val) as Stat[];
      } else {
        this.stats = [];
      }
    });
    this.unsubs.push(unsub);
  }

  private subscribeToCurrentTours() {
    const unsub = this.firebaseSvc.onValue('monitor/currentTours', (val) => {
      console.log('🚌 Current tours from Firebase:', val);
      if (val) {
        this.currentTours = Object.values(val) as Tour[];
      } else {
        this.currentTours = [];
      }
    });
    this.unsubs.push(unsub);
  }

  private subscribeToActivities() {
    const unsub = this.firebaseSvc.onValue('monitor/activities', (val) => {
      console.log('📋 Activities from Firebase:', val);
      if (val) {
        const arr = Object.values(val) as Activity[];
        this.activities = arr.reverse();
      } else {
        this.activities = [];
      }
    });
    this.unsubs.push(unsub);
  }

  // ── Navigation ────────────────────────────────────────────────────
  navigateTo(page: string) {
    const routes: { [key: string]: string } = {
      'dashboard': '/dashboard',
      'bookings': '/tourguide',
      'feedback': '/feedback-ratings',
      'monitoring': '/monitoring',
      'number-of-tourist': '/number-of-tourist'
    };
    const route = routes[page];
    if (route) this.router.navigate([route]);
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  // ── Add Destination Modal ─────────────────────────────────────────
  openAddDestinationModal() {
    this.newDestination = this.getEmptyDestination();
    this.showAddDestinationModal = true;
    setTimeout(() => this.initMap(), 0);
  }

  closeAddDestinationModal() {
    this.showAddDestinationModal = false;
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.marker = null;
    }
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.closeAddDestinationModal();
    }
  }

  private getEmptyDestination(): NewDestination {
    return {
      name: '',
      description: '',
      imagePreview: null,
      imageFile: null,
      infoBlocks: [],
      location: null,
      address: ''
    };
  }

  // ── Image Upload ──────────────────────────────────────────────────
  triggerImageUpload() {
    this.imageInputRef?.nativeElement.click();
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.newDestination.imageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.newDestination.imagePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  removeImage(event: MouseEvent) {
    event.stopPropagation();
    this.newDestination.imagePreview = null;
    this.newDestination.imageFile = null;
    if (this.imageInputRef) this.imageInputRef.nativeElement.value = '';
  }

  // ── Info Blocks ───────────────────────────────────────────────────
  addInfoBlock() {
    this.newDestination.infoBlocks.push({ title: '', type: 'none', items: [''], plainText: '' });
  }

  removeInfoBlock(index: number) {
    this.newDestination.infoBlocks.splice(index, 1);
  }

  setBlockType(blockIndex: number, type: 'none' | 'bullet' | 'check') {
    this.newDestination.infoBlocks[blockIndex].type = type;
  }

  addBlockItem(blockIndex: number) {
    this.newDestination.infoBlocks[blockIndex].items.push('');
  }

  removeBlockItem(blockIndex: number, itemIndex: number) {
    this.newDestination.infoBlocks[blockIndex].items.splice(itemIndex, 1);
  }

  // ── Map (Leaflet / OpenStreetMap) ─────────────────────────────────
  private initMap() {
    if (this.map) {
      this.map.invalidateSize();
      return;
    }

    const center: L.LatLngExpression = [14.58, 121.085]; // Pasig City
    this.map = L.map('osm-map', {
      center,
      zoom: 13,
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      ]
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.onLeafletMapClick(e.latlng);
    });
  }

  private onLeafletMapClick(latlng: L.LatLng) {
    if (!this.map) return;
    const bounds = this.map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latRange = ne.lat - sw.lat;
    const lngRange = ne.lng - sw.lng;

    this.newDestination.location = {
      lat: latlng.lat,
      lng: latlng.lng,
      xPercent: ((latlng.lng - sw.lng) / lngRange) * 100,
      yPercent: ((ne.lat - latlng.lat) / latRange) * 100
    };

    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker(latlng).addTo(this.map);
  }

  // ── Save Destination to Firebase ──────────────────────────────────
  canSaveDestination(): boolean {
    return (
      !this.isSaving &&
      this.newDestination.name.trim().length > 0 &&
      this.newDestination.description.trim().length > 0 &&
      this.newDestination.location !== null
    );
  }

  async saveDestination() {
    if (!this.canSaveDestination()) return;
    this.isSaving = true;

    try {
      let imageUrl: string | null = null;

      if (this.newDestination.imageFile) {
        const timestamp = Date.now();
        const safeName = this.newDestination.imageFile.name.replace(/\s+/g, '_');
        const storagePath = `destinations/${timestamp}_${safeName}`;
        imageUrl = await this.firebaseSvc.uploadFile(storagePath, this.newDestination.imageFile);
      }

      const payload = {
        name: this.newDestination.name.trim(),
        description: this.newDestination.description.trim(),
        imageUrl,
        infoBlocks: this.newDestination.infoBlocks,
        location: this.newDestination.location,
        address: this.newDestination.address.trim(),
        createdAt: new Date().toISOString()
      };

      await this.firebaseSvc.pushData('destinations', payload);

      console.log('✅ Destination saved to Firebase:', payload);
      this.closeAddDestinationModal();
    } catch (err) {
      console.error('❌ Error saving destination:', err);
    } finally {
      this.isSaving = false;
    }
  }
}