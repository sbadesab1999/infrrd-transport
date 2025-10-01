import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ride } from '../../app/models/ride.model';


const STORAGE_KEY = 'infrd_rides_v1';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private ridesSub = new BehaviorSubject<Ride[]>([]);
  rides$ = this.ridesSub.asObservable();

  constructor() {
    const raw = localStorage.getItem(STORAGE_KEY);
    this.ridesSub.next(raw ? JSON.parse(raw) : []);
  }

  private persist(rides: Ride[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rides));
    this.ridesSub.next(rides);
  }

  getRidesSnapshot(): Ride[] {
    return this.ridesSub.value.slice();
  }

  addRide(payload: Omit<Ride, 'id'|'bookings'|'createdAt'>) {
    // Basic validation (caller should have validated required fields already)
    const id = 'ride-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
    const newRide: Ride = {
      ...payload,
      id,
      bookings: [],
      createdAt: new Date().toISOString()
    };
    const updated = [newRide, ...this.getRidesSnapshot()];
    this.persist(updated);
    return newRide;
  }

  bookRide(rideId: string, employeeId: string) {
    const rides = this.getRidesSnapshot();
    const idx = rides.findIndex(r => r.id === rideId);
    if (idx === -1) throw new Error('Ride not found');
    const ride = rides[idx];

    if (ride.employeeId === employeeId) throw new Error('Owner cannot book own ride');
    if (ride.bookings.includes(employeeId)) throw new Error('Employee already booked this ride');
    if (ride.vacantSeats <= 0) throw new Error('No vacant seats');

    const updatedRide: Ride = {
      ...ride,
      vacantSeats: ride.vacantSeats - 1,
      bookings: [...ride.bookings, employeeId]
    };
    rides[idx] = updatedRide;
    this.persist(rides);
    return updatedRide;
  }

  // helper: filter by vehicle type
  filterByVehicle(type: 'All'|'Bike'|'Car') {
    const all = this.getRidesSnapshot();
    if (type === 'All') return all;
    return all.filter(r => r.vehicleType === type);
  }

  // seed demo data (optional)
  seedDemo() {
    const sample = [
      {
        employeeId: 'E100',
        vehicleType: 'Bike',
        vehicleNo: 'KA01AB1111',
        vacantSeats: 2,
        timeIso: new Date(new Date().setHours(9, 30, 0, 0)).toISOString(),
        pickupPoint: 'Gate A',
        destination: 'Office 1'
      },
      {
        employeeId: 'E101',
        vehicleType: 'Car',
        vehicleNo: 'KA01AB2222',
        vacantSeats: 3,
        timeIso: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
        pickupPoint: 'Gate B',
        destination: 'Office 2'
      }
    ].map(r => ({
      ...r,
      id: 'ride-' + Date.now() + '-' + Math.random().toString(36).slice(2,5),
      bookings: [],
      createdAt: new Date().toISOString()
    }));
    // this.persist([...sample, ...this.getRidesSnapshot()]);
  }
}

