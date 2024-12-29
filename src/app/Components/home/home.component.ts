import { Component, ElementRef, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GeoService } from 'src/app/Services/geo.service';
import { catchError, of } from 'rxjs';
import { GasStationStateService } from 'src/app/Services/gas-station-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  location!: string;
  fuel!: string[];
  geolocation!: [number, number];
  @ViewChild('map') mapComponent!: MapComponent;
  @ViewChild('endSection') endSection!: ElementRef;
  gasStations: GasStationDTO[] = [];
  isGasStationListVisible: boolean = false;

  constructor(private geoService: GeoService, private gasStationStateService: GasStationStateService){}

  locationSelected(location:string): void{
    this.location = location;
  }

  FuelSelected(fuel:string[]): void{
    this.fuel = fuel;
  }

  geolocationSelected(geolocation:[number, number]): void{
    this.geolocation = geolocation;
    this.geoService.getLocationFromCoordinates(this.geolocation).pipe(
      catchError(error => {
        console.error('No se ha podido obtener la ubicación de las coordenadas:', error);
        return of(null);
      })
    ).subscribe(location => {
      if (location) {
        this.location = location.address.town;
      } else {
        console.error('No se ha podido obtener la ubicación de las coordenadas');
      }
    });
  }

  gasStationsListReceived(gasStations: GasStationDTO[]): void {
    this.gasStations = gasStations;
    if (this.gasStations.length === 0) {
      this.mapComponent.resetMapView();
    }
    else{
      const savedState = this.gasStationStateService.getGasStationsState();
      if (savedState) {
        this.location = savedState.location;      
      }
      this.isGasStationListVisible = true;
      this.mapComponent.updateMapLocation(this.location);
      this.mapComponent.addMapGasStations(this.gasStations);
    }
    setTimeout(() => {
      this.endSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  }

}
