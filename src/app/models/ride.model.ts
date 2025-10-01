export interface Ride {
  id: string;
  employeeId: string;       // owner/creator of the ride (mandatory)
  vehicleType: 'Bike'|'Car';
  vehicleNo: string;
  vacantSeats: number;
  timeIso: string;          // ISO datetime string for today's date + time
  pickupPoint: string;
  destination: string;
  bookings: string[];       // employeeIds who booked
  createdAt: string;
}
