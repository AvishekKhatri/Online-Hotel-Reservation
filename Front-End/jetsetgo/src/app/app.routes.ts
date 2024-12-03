import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HotelListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { HotelBookingComponent } from'./components/hotel-booking/hotel-booking.component';
export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: HomeComponent }, // Redirect root to Home
  { path: '', component: LoginComponent },
  { path: 'hotels', component: HotelListComponent },
  { path: 'booking/:id', component: HotelBookingComponent },
  { path: 'hotels/:id', component: HotelDetailsComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, // Catch-all route to Home
];




