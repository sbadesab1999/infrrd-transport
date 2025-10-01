import { Component, OnInit } from '@angular/core';
import { RideService } from '../../services/services/ride.service';
import { Ride } from '../../app/models/ride.model';
import { isWithinBufferMinutes, todayIsoFromHHMM } from '../../app/utils/time-utils';
import { CommonModule } from '@angular/common';
import { RideItemComponent } from "../ride-item/ride-item.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ride-list',
  imports: [CommonModule, RideItemComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './ride-list.component.html',
  styleUrl: './ride-list.component.css'
})
export class RideListComponent implements OnInit {
  rides: Ride[] = [];
  vehicleFilter: 'All'|'Bike'|'Car' = 'All';
  timeFilter = ''; // 'HH:MM' or empty
  bufferMinutes = 60;

  constructor(private rideService: RideService) {}

  ngOnInit() {
    this.rideService.rides$.subscribe(list => this.rides = list);
  }

  get filteredRides(): Ride[] {
    let arr = (this.vehicleFilter === 'All') ? this.rides : this.rides.filter(r => r.vehicleType === this.vehicleFilter);
    if (this.timeFilter) {
      const targetIso = todayIsoFromHHMM(this.timeFilter);
      arr = arr.filter(r => isWithinBufferMinutes(r.timeIso, targetIso, this.bufferMinutes));
    }
    return arr;
  }

  onSeed() { this.rideService.seedDemo(); }
}
