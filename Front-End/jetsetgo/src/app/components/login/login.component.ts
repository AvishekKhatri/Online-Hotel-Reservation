import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  currentTab: string = 'login'; // Default to login tab

  // Login form data
  loginData = {
    username: '',
    password: ''
  };

  // Signup form data
  signupData = {
    username: '',
    password: '',
    retypePassword: '',
    phone: ''
  };

  // Inject HttpClient and Router
  constructor(private http: HttpClient, private router: Router) {}

  // Switch between Login and Signup tabs
  switchTab(tab: string): void {
    this.currentTab = tab;
  }

  // Handle login submission
  handleLogin(): void {
    this.http.post('http://localhost:8080/api/auth/login', this.loginData).subscribe(
      (response: any) => {
        console.log('Login Successful:', response);
        localStorage.setItem('userId', response.userId);
        this.router.navigate(['/home']); // Navigate to the home page
      },
      (error) => {
        console.error('Login Failed:', error);
        if (error.error && error.error.message) {
          alert(error.error.message); // Display error message from backend
        } else {
          alert('Login failed. Please try again.');
        }
      }
    );
  }
  
  
  handleSignup(): void {
    if (this.signupData.password !== this.signupData.retypePassword) {
      alert('Passwords do not match!');
      return;
    }
  
    this.http.post('http://localhost:8080/api/auth/signup', this.signupData).subscribe(
      (response: any) => {
        console.log('Signup Successful:', response);
        alert(response.message || 'Signup successful! You can now log in.');
        this.switchTab('login'); // Switch to login tab
      },
      (error) => {
        console.error('Signup Failed:', error);
        const errorMessage = error.error?.message || 'Signup failed. Please try again.';
        alert(errorMessage);
      }
    );
  }
  
  
}
