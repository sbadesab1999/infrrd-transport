import { Component } from '@angular/core';
import { RideListComponent } from '../components/ride-list/ride-list.component';
import { AddRideComponent } from "../components/add-ride/add-ride.component";

@Component({
  selector: 'app-root',
  imports: [RideListComponent, AddRideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
