import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationService } from 'src/app/Services/gas-station.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.css']
})
export class GasStationListComponent {

  gasStations: GasStationDTO[] = [];
  sortedGasStations: GasStationDTO[] = [];
  isSearched: boolean = false;
  message: string = '';
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  locationIndication: boolean = false;

  @Input() location!: string;
  @Input() fuel!: string[];
  @Output() gasStationsListReceived = new EventEmitter<GasStationDTO[]>();

  displayedColumns: string[] = ['marca', 'direccion', 'localidad', 'horario', 'fecha'];

  fuelMapping: { [key: string]: string } = {
    "Gasolina 95": "gasolina95",
    "Gasolina 98": "gasolina98",
    "Diesel": "diesel",
    "Diesel Premium": "dieselPremium",
  };

  fuelPriceMapping: { [key: string]: string } = {
    "Gasolina 95": "preciogasolina95",
    "Gasolina 98": "preciogasolina98",
    "Diesel": "preciodiesel",
    "Diesel Premium": "preciodieselpremium",
  };

  constructor(private gasStationService: GasStationService, private userService: UserService){
    this.isAuthenticated = this.userService.isAuthenticated();
  }

  ngOnChanges():void {
    if (this.location) {
      this.location = this.formatLocation(this.location);
      if(this.location && this.fuel){
        this.getGasStationsByLocationAndFuel(this.location, this.fuel);
        this.updateDisplayedColumns();
      }
      else{
        this.getGasStationsbyLocation(this.location);
        this.displayedColumns = ['marca', 'direccion', 'localidad', 'horario', 'diesel', 'dieselPremium', 'gasolina95', 'gasolina98', 'fecha'];
      }
    }
  }

  updateDisplayedColumns(): void {
    const fuelColumns = this.fuel
      .map(fuelType => this.fuelMapping[fuelType])
      .filter(column => column);
    this.displayedColumns = ['marca', 'direccion', 'localidad', 'horario', ...fuelColumns, 'fecha'];
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
        }
        else{
          this.gasStations = data;
          this.sortedGasStations = this.gasStations.slice();
          this.message = '';
        }
        this.gasStationsListReceived.emit(this.gasStations);
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
        }
        else{
          this.gasStations = data;
          this.sortedGasStations = this.gasStations.slice();
          this.message = '';
        }
        this.gasStationsListReceived.emit(this.gasStations);

      },
      (error) => {
        console.error('Error al obtener las gasolineras de la población', error);
        this.message = 'Hubo un error al obtener las gasolineras. Por favor, inténtalo de nuevo más tarde.';
        this.isLoading = false;
      }
    )
  }

  sortData(sort: Sort) {    
    const data = this.gasStations.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.sortedGasStations = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';      
      switch (sort.active) {
        case 'diesel':          
          return this.compare(a.preciodiesel, b.preciodiesel, isAsc);
        case 'dieselPremium':
          return this.compare(a.preciodieselpremium, b.preciodieselpremium, isAsc);
        case 'gasolina95':
          return this.compare(a.preciogasolina95, b.preciogasolina95, isAsc);
        case 'gasolina98':
          return this.compare(a.preciogasolina98, b.preciogasolina98, isAsc);
        default:
          return 0;
      }
    });
    this.gasStations = this.sortedGasStations;
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
}

