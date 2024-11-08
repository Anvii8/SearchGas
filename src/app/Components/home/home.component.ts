import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  location!: string;
  @ViewChild('map') mapComponent!: MapComponent;
  gasStations: GasStationDTO[] = [];

  locationSelected(location:string): void{
    this.location = location;
  }

  gasStationsListReceived(gasStations: GasStationDTO[]): void {
    this.gasStations = gasStations;

    if (this.gasStations.length === 0) {
      this.mapComponent.resetMapView();
    }
    else{
      this.mapComponent.updateMapLocation(this.location);
      this.mapComponent.addMapGasStations(this.gasStations);
    }
  }

}
