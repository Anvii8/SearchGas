import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationService } from 'src/app/Services/gas-station.service';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.css']
})
export class GasStationListComponent {

  gasStations: GasStationDTO[] = [];
  isSearched: boolean = false;
  message: string = '';
  isLoading: boolean = false;
  locationIndication: boolean = false;

  @Input() location!: string;
  @Input() fuel!: string[];
  @Output() gasStationsListReceived = new EventEmitter<GasStationDTO[]>();

  constructor(private gasStationService: GasStationService){}

  ngOnChanges() {
    if (this.location) {
      this.location = this.formatLocation(this.location);
      if(this.location && this.fuel){
        this.getGasStationsByLocationAndFuel(this.location, this.fuel);
      }
      else{
        this.getGasStationsbyLocation(this.location);
      }
    }
  }

  getGasStationsbyLocation(location: string): void{
    this.locationIndication = true;
    this.isLoading = true;
    this.gasStationService.getGasStationByLocation(location).subscribe(
      (data) => {
        this.isSearched = true;

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        
        if(data.length === 0){
          this.message = 'No se han encontrado gasolineras en esta población. Por favor, pruebe con otra población.';
          this.gasStations = [];
          this.gasStationsListReceived.emit(this.gasStations);
        }
        else{
          this.gasStations = data;
          this.gasStationsListReceived.emit(this.gasStations);
          this.message = '';
        }
      },
      (error) => {
        console.error('Error al obtener las gasolineras de la población', error);
        this.message = 'Hubo un error al obtener las gasolineras. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    )
  }

  formatLocation(location: string): string {
    return location.charAt(0).toUpperCase() + location.slice(1).toLowerCase();
  }

  getFuelPrices(gasStation: GasStationDTO) {
    return [
        { type: 'Diesel', price: gasStation.preciodiesel },
        { type: 'Diesel Premium', price: gasStation.preciodieselpremium },
        { type: 'Gasolina 95', price: gasStation.preciogasolina95 },
        { type: 'Gasolina 98', price: gasStation.preciogasolina98 }
    ].filter(fuel => fuel.price != 0.000);
  }

  getGasStationsByLocationAndFuel(location: string, fuel: string[]): void{
    this.locationIndication = true;
    this.isLoading = true;
    this.gasStationService.getGasStationByLocationAndFuel(location, fuel).subscribe(
      (data) => {
        this.isSearched = true;

        setTimeout(() => {
          this.isLoading = false;
        }, 500);
        
        if(data.length === 0){
          this.message = 'No se han encontrado gasolineras en esta población. Por favor, pruebe con otra población y/o seleccione otro tipo de combustible.';
          this.gasStations = [];
          this.gasStationsListReceived.emit(this.gasStations);
        }
        else{
          this.gasStations = data;
          this.gasStationsListReceived.emit(this.gasStations);
          this.message = '';
        }
      },
      (error) => {
        console.error('Error al obtener las gasolineras de la población', error);
        this.message = 'Hubo un error al obtener las gasolineras. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    )
  }

}

