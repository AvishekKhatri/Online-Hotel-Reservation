import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hotel-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css'],
})
export class HotelBookingComponent implements OnInit {
  bookingForm!: FormGroup;
  isProcessing = false;
  bookingConfirmed = false;

  hotel: any = null; // Hotel details
  numberOfPersons = 1; // Default: 1 person
  numberOfRooms = 1; // Default: 1 room
  checkInDate: string = ''; // Check-in date
  checkOutDate: string = ''; // Check-out date
  instantDiscount = 1000; // Static discount
  couponDiscount = 500; // Static discount
  taxRate = 0.18; // Tax rate
  totalPayable = 0; // Calculated total
  minDate = new Date().toISOString().split('T')[0]; // Prevent past dates

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    const queryParams = this.route.snapshot.queryParams;

    // Retrieve query parameters from hotel-details page
    this.checkInDate = queryParams['checkInDate'] || this.minDate;
    this.checkOutDate = queryParams['checkOutDate'] || this.minDate;
    this.numberOfPersons = +queryParams['selectedPersons'] || 1;
    this.numberOfRooms = +queryParams['selectedRooms'] || 1;

    if (hotelId) {
      this.fetchHotelDetails(hotelId);
    }

    // Initialize the booking form
    this.bookingForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      paymentMethod: ['', Validators.required],
    });

    this.calculateTotal();
  }

  // Fetch hotel details
  fetchHotelDetails(hotelId: string): void {
    this.http.get(`http://localhost:8080/hotels/${hotelId}`).subscribe(
      (data: any) => {
        this.hotel = data;
        this.calculateTotal();
      },
      (error) => {
        console.error('Error fetching hotel details:', error);
      }
    );
  }
  navigateTo(destination: string): void {
    if (destination === 'home') {
      this.router.navigate(['/home']); // Navigate to the Home page
    } else if (destination === 'hotels') {
      this.router.navigate(['/hotels']); // Navigate to the Hotels list
    }
  }
  // Calculate nights between check-in and check-out
  calculateNights(): number {
    const checkIn = new Date(this.checkInDate);
    const checkOut = new Date(this.checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return 0;
    }
    return Math.ceil(
      Math.abs(checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Calculate taxes
  calculateTaxes(): number {
    const roomCost =
      this.calculateNights() * (this.hotel?.price || 0) * this.numberOfRooms;
    return roomCost * this.taxRate;
  }

  // Calculate total price
  calculateTotal(): void {
    const roomCost =
      this.calculateNights() * (this.hotel?.price || 0) * this.numberOfRooms;
    const discounts = this.instantDiscount + this.couponDiscount;
    const taxes = this.calculateTaxes();
    this.totalPayable = roomCost - discounts + taxes;
  }

  // Handle booking submission
  submitBooking(): void {
    if (!this.bookingForm.valid) {
      alert('Please fill in all required fields.');
      return;
    }

    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      alert('User not logged in!');
      this.router.navigate(['/login']);
      return;
    }

    const bookingSummary = {
      userId,
      hotelId: this.hotel?.id,
      hotelName: this.hotel?.name,
      location: this.hotel?.location,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
      numberOfNights: this.calculateNights(),
      roomPricePerNight: this.hotel?.price,
      instantDiscount: this.instantDiscount,
      couponDiscount: this.couponDiscount,
      taxes: this.calculateTaxes(),
      totalPayable: this.totalPayable,
      numberOfPersons: this.numberOfPersons,
      numberOfRooms: this.numberOfRooms,
      ...this.bookingForm.value,
    };

    console.log('Booking Summary:', bookingSummary);

    this.isProcessing = true;
    this.http.post('http://localhost:8080/bookings', bookingSummary).subscribe(
      (response: any) => {
        console.log('Booking Successful:', response);
        this.bookingConfirmed = true;
        this.isProcessing = false;
      },
      (error) => {
        console.error('Booking Failed:', error);
        alert('Booking failed. Please try again.');
        this.isProcessing = false;
      }
    );
  }

  // Increment and decrement handlers
  incrementRooms(): void {
    this.numberOfRooms++;
    this.calculateTotal();
  }

  decrementRooms(): void {
    if (this.numberOfRooms > 1) {
      this.numberOfRooms--;
      this.calculateTotal();
    }
  }

  incrementPersons(): void {
    this.numberOfPersons++;
    this.calculateTotal();
  }

  decrementPersons(): void {
    if (this.numberOfPersons > 1) {
      this.numberOfPersons--;
      this.calculateTotal();
    }
  }
}
