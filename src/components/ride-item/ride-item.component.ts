import { Component, Input } from '@angular/core';
import { RideService } from '../../services/services/ride.service';
import { Ride } from '../../app/models/ride.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-item',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ride-item.component.html',
  styleUrl: './ride-item.component.css',
})
export class RideItemComponent {
  @Input() ride!: Ride;
  bookingId = '';
  message = '';

  constructor(private rideService: RideService) {}

  onBook() {
    this.message = '';
    if (!this.bookingId || !this.bookingId.trim()) {
      this.message = 'Enter Employee ID';
      return;
    }
    try {
      this.rideService.bookRide(this.ride.id, this.bookingId.trim());
      this.message = 'Booked successfully';
      this.bookingId = '';
    } catch (err: any) {
      this.message = err.message || 'Booking failed';
    }
  }
}
