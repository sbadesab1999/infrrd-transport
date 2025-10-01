import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RideService } from '../../services/services/ride.service';
import { isSameDayIso, todayIsoFromHHMM } from '../../app/utils/time-utils';

@Component({
  selector: 'app-add-ride',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-ride.component.html',
  styleUrl: './add-ride.component.css',
})
export class AddRideComponent implements OnInit {
  Rideform: FormGroup;
  errorMsg = '';
  constructor(public fb: FormBuilder, private rideService: RideService) {
    this.Rideform = this.fb.group({
      employeeId: ['', Validators.required],
      vehicleType: ['Bike', Validators.required],
      vehicleNo: ['', Validators.required],
      vacantSeats: [1, [Validators.required, Validators.min(1)]],
      time: ['', Validators.required],
      pickupPoint: ['', Validators.required],
      destination: ['', Validators.required],
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    this.errorMsg = '';
    if (this.Rideform.invalid) {
      this.errorMsg = 'Please fill all mandatory fields correctly.';
      return;
    }

    const values = this.Rideform.value;
    const iso = todayIsoFromHHMM(values.time);
    if (!isSameDayIso(iso)) {
      this.errorMsg = 'Time must be for today only.';
      return;
    }

    try {
      this.rideService.addRide({
        employeeId: values.employeeId.trim(),
        vehicleType: values.vehicleType,
        vehicleNo: values.vehicleNo.trim(),
        vacantSeats: Number(values.vacantSeats),
        timeIso: iso,
        pickupPoint: values.pickupPoint.trim(),
        destination: values.destination.trim(),
      });
      this.Rideform.reset({ vehicleType: 'Bike', vacantSeats: 1 });
      this.errorMsg = '';
    } catch (err: any) {
      this.errorMsg = err.message || 'Could not add ride';
    }
  }
}
