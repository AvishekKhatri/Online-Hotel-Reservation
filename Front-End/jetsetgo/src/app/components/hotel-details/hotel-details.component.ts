import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit {
  Math = Math;
  hotel: any = null; // Hotel details fetched from the backend
  carouselImages: string[] = []; // Placeholder for carousel images
  currentImageIndex = 0;

  // Fields for booking details
  checkInDate: string = ''; // To bind to the check-in date input
  checkOutDate: string = ''; // To bind to the check-out date input
  selectedRooms: number = 1; // Default value for rooms
  selectedPersons: number = 1; // Default value for persons
  totalPrice: number = 0; // Dynamically calculated total price

  // Default options for persons and rooms
  maxRooms: number = 5;
  maxPersons: number = 10;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    this.fetchHotelDetails(hotelId);
  }

  fetchHotelDetails(hotelId: string | null): void {
    if (hotelId) {
      this.http.get(`http://localhost:8080/hotels/${hotelId}`).subscribe(
        (data: any) => {
          this.hotel = data;
          this.carouselImages = [
            'https://w0.peakpx.com/wallpaper/205/649/HD-wallpaper-hotel-room-interior-design-luxury-hotel-apartments-modern-interior-design-classic-style-luxury-chandelier.jpg',
            'https://w0.peakpx.com/wallpaper/39/403/HD-wallpaper-modern-interior-design-living-room-classic-style-white-marble-floor-stylish-interior-luxury-apartments.jpg',
            'https://media.istockphoto.com/id/1300135335/photo/luxurious-bedroom-interior-at-nigh-with-messy-bed-leather-armchairs-closet-and-garden-view.jpg?s=612x612&w=0&k=20&c=3tFjNfMis-qELQ04hUmiG3W0i-5d7jBjaOP5YtB4sIw=',
          ]; // Fallback carousel images if none are provided
          this.updateBookingSummary(); // Initial calculation
        },
        (error) => {
          console.error('Error fetching hotel details:', error);
        }
      );
    }
  }

  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.carouselImages.length;
  }

  prevImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.carouselImages.length) %
      this.carouselImages.length;
  }

  updateBookingSummary(): void {
    if (!this.hotel || !this.checkInDate || !this.checkOutDate) {
      this.totalPrice = 0; // Reset if data is incomplete
      return;
    }

    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);
    const days = Math.max(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      0
    ); // Calculate number of days

    const basePrice = this.hotel.price || 0;
    this.totalPrice = basePrice * days * this.selectedRooms; // Calculate total price
  }

  decreaseRooms(): void {
    if (this.selectedRooms > 1) {
      this.selectedRooms--;
      this.updateBookingSummary();
    }
  }

  increaseRooms(): void {
    if (this.selectedRooms < 5) {
      this.selectedRooms++;
      this.updateBookingSummary();
    }
  }

  // Logic to increase or decrease persons
  decreasePersons(): void {
    if (this.selectedPersons > 1) {
      this.selectedPersons--;
      this.updateBookingSummary();
    }
  }

  increasePersons(): void {
    if (this.selectedPersons < 10) {
      this.selectedPersons++;
      this.updateBookingSummary();
    }
  }
  canBook(): boolean {
    return this.checkInDate !== '' && this.checkOutDate !== '' && this.totalPrice > 0;
  }
}
