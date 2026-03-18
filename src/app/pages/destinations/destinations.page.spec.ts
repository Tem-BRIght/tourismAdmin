import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DestinationsPage } from './destinations.page';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('DestinationsPage', () => {
  let component: DestinationsPage;
  let fixture: ComponentFixture<DestinationsPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spies
    const authSpy = jasmine.createSpyObj('AuthService', ['hasAccess', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    
    await TestBed.configureTestingModule({
      declarations: [DestinationsPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationsPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Mock hasAccess to return true for all permissions
    authServiceSpy.hasAccess.and.returnValue(true);
    
    fixture.detectChanges();
  });

  it('should create the destinations page', () => {
    expect(component).toBeTruthy();
  });

  it('should load sample content data', () => {
    expect(component.contents.length).toBe(3);
    expect(component.filteredContents.length).toBe(3);
  });

  it('should have correct sample data', () => {
    const firstContent = component.contents[0];
    expect(firstContent.id).toBe('CONT001');
    expect(firstContent.title).toBe('Rainforest Park');
    expect(firstContent.status).toBe('published');
  });

  it('should calculate total published correctly', () => {
    const publishedCount = component.contents.filter(c => c.status === 'published').length;
    expect(component.getTotalPublished()).toBe(publishedCount);
  });

  it('should calculate total drafts correctly', () => {
    const draftCount = component.contents.filter(c => c.status === 'draft').length;
    expect(component.getTotalDraft()).toBe(draftCount);
  });

  it('should apply search filter correctly', () => {
    const initialCount = component.filteredContents.length;
    
    // Test search by title
    component.searchTerm = 'Rainforest';
    component.applyFilters();
    expect(component.filteredContents.length).toBe(1);
    expect(component.filteredContents[0].title).toContain('Rainforest');
    
    // Reset
    component.resetFilters();
    expect(component.filteredContents.length).toBe(initialCount);
  });

  it('should search by description text', () => {
    component.searchTerm = 'cathedral';
    component.applyFilters();
    expect(component.filteredContents.length).toBe(1);
    expect(component.filteredContents[0].title).toBe('Pasig Cathedral');
  });

  it('should reset filters correctly', () => {
    component.searchTerm = 'Test Search';
    component.applyFilters();
    
    component.resetFilters();
    
    expect(component.searchTerm).toBe('');
    expect(component.filteredContents.length).toBe(component.contents.length);
  });

  it('should open create modal', () => {
    component.openCreateModal();
    expect(component.showContentModal).toBeTrue();
    expect(component.isEditing).toBeFalse();
    expect(component.selectedContent).toBeNull();
    expect(component.contentForm.title).toBe('');
  });

  it('should open edit modal', () => {
    const content = component.contents[0];
    component.openEditModal(content);
    
    expect(component.showContentModal).toBeTrue();
    expect(component.isEditing).toBeTrue();
    expect(component.selectedContent).toEqual(content);
    expect(component.contentForm.title).toEqual(content.title);
  });

  it('should view content details', () => {
    const content = component.contents[0];
    component.viewContent(content);
    
    expect(component.showContentModal).toBeTrue();
    expect(component.isEditing).toBeFalse();
    expect(component.selectedContent).toEqual(content);
  });

  it('should close modal', () => {
    component.showContentModal = true;
    component.selectedContent = component.contents[0];
    
    component.closeModal();
    
    expect(component.showContentModal).toBeFalse();
    expect(component.selectedContent).toBeNull();
    expect(component.isEditing).toBeFalse();
  });

  it('should remove image', () => {
    component.contentForm.imageUrl = 'test-url';
    component.contentForm.imageFile = {} as File;
    
    component.removeImage();
    
    expect(component.contentForm.imageUrl).toBe('');
    expect(component.contentForm.imageFile).toBeUndefined();
  });

  it('should save new content', (done) => {
    const initialCount = component.contents.length;
    
    component.openCreateModal();
    component.contentForm.title = 'New Test Destination';
    component.contentForm.description = 'This is a test description';
    
    component.saveContent();
    
    // Wait for setTimeout
    setTimeout(() => {
      expect(component.contents.length).toBe(initialCount + 1);
      expect(component.filteredContents.length).toBe(initialCount + 1);
      done();
    }, 600);
  });

  it('should edit existing content', (done) => {
    const content = component.contents[0];
    const newTitle = 'Updated Title';
    
    component.openEditModal(content);
    component.contentForm.title = newTitle;
    component.saveContent();
    
    // Wait for setTimeout
    setTimeout(() => {
      const updatedContent = component.contents.find(c => c.id === content.id);
      expect(updatedContent?.title).toBe(newTitle);
      done();
    }, 600);
  });

  it('should confirm delete', () => {
    const content = component.contents[0];
    component.confirmDelete(content);
    
    expect(component.showDeleteConfirm).toBeTrue();
    expect(component.selectedContent).toEqual(content);
  });

  it('should cancel delete', () => {
    component.showDeleteConfirm = true;
    component.selectedContent = component.contents[0];
    
    component.cancelDelete();
    
    expect(component.showDeleteConfirm).toBeFalse();
    expect(component.selectedContent).toBeNull();
  });

  it('should delete content', (done) => {
    const initialCount = component.contents.length;
    const content = component.contents[0];
    
    component.confirmDelete(content);
    component.deleteContent();
    
    // Wait for setTimeout
    setTimeout(() => {
      expect(component.contents.length).toBe(initialCount - 1);
      expect(component.filteredContents.length).toBe(initialCount - 1);
      expect(component.showDeleteConfirm).toBeFalse();
      done();
    }, 600);
  });

  it('should handle pagination correctly', () => {
    component.itemsPerPage = 2;
    const totalPages = Math.ceil(component.filteredContents.length / 2);
    
    expect(component.totalPages).toBe(totalPages);
    
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    
    component.nextPage();
    expect(component.currentPage).toBe(3);
    
    component.previousPage();
    expect(component.currentPage).toBe(2);
  });

  it('should generate page array correctly', () => {
    component.currentPage = 1;
    component.totalItems = 20;
    component.itemsPerPage = 5;
    
    const pages = component.getPageArray();
    expect(pages.length).toBeLessThanOrEqual(5);
    expect(pages[0]).toBe(1);
  });

  it('should return paginated contents', () => {
    component.itemsPerPage = 2;
    component.currentPage = 1;
    
    const paginated = component.paginatedContents;
    expect(paginated.length).toBeLessThanOrEqual(2);
  });

  it('should set permissions on init', () => {
    expect(authServiceSpy.hasAccess).toHaveBeenCalled();
    expect(component.canCreate).toBeTrue();
    expect(component.canUpdate).toBeTrue();
    expect(component.canDelete).toBeTrue();
  });

  it('should navigate to other pages', () => {
    component.navigateTo('dashboard');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    
    component.navigateTo('bookings');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tourguide']);
    
    component.navigateTo('destinations');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/destinations']);
  });

  it('should logout', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});