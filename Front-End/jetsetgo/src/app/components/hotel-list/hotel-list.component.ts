import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css']
})
export class HotelListComponent implements OnInit {
  searchQuery: string = '';
  maxPrice: number = 5000;
  minPriceLimit: number = 1000;
  maxPriceLimit: number = 5000;

  checkInDate: string | null = null;
  checkOutDate: string | null = null;

  filters = {
    amenities: {} as Record<string, boolean>, // Dynamic amenities initialized as an empty object
  };

  hotels: any[] = [];
  originalHotels: any[] = [];
  sortCriteria: string = 'priceLowToHigh'; // Default sorting by price (Low to High)

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/hotels').subscribe(
      (data: any) => {
        this.hotels = data;
        this.originalHotels = data;
        this.generateDynamicAmenities();
      },
      (error) => {
        console.error('Error fetching hotels:', error);
      }
    );
  }

  /**
   * Generate dynamic amenities from the fetched hotel data
   */
  generateDynamicAmenities() {
    const allAmenities = new Set<string>();
    this.originalHotels.forEach((hotel) => {
      if (hotel.amenities && Array.isArray(hotel.amenities)) {
        hotel.amenities.forEach((amenity: string) => allAmenities.add(amenity));
      }
    });

    allAmenities.forEach((amenity) => {
      this.filters.amenities[amenity] = false; // Initialize all amenities as unchecked
    });
  }

  /**
   * Helper method to get amenity keys
   */toggleAmenity(amenity: string) {
  this.filters.amenities[amenity] = !this.filters.amenities[amenity];
}

getAmenityKeys() {
  return Object.keys(this.filters.amenities);
}


  /**
   * Filter and sort hotels based on user input and selections
   */
  filteredHotels() {
    let filtered = [...this.originalHotels];

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(query) ||
          hotel.location.toLowerCase().includes(query)
      );
    }

    // Filter by max price
    filtered = filtered.filter((hotel) => hotel.price <= this.maxPrice);

    // Filter by selected amenities (intersection logic)
    const selectedAmenities = Object.keys(this.filters.amenities).filter(
      (amenity) => this.filters.amenities[amenity]
    );

    if (selectedAmenities.length > 0) {
      filtered = filtered.filter((hotel) =>
        selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      );
    }

    // Sort by selected criteria
    if (this.sortCriteria === 'priceLowToHigh') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortCriteria === 'priceHighToLow') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }
}
