import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationStateService } from 'src/app/Services/gas-station-state.service';
import { GasStationService } from 'src/app/Services/gas-station.service';
import { GeoService } from 'src/app/Services/geo.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.css']
})
export class GasStationListComponent implements OnInit {

  gasStations: GasStationDTO[] = [];
  isSearched: boolean = false;
  message: string = '';
  dieselType: string = '';
  gasType: string = '';
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  locationIndication: boolean = false;
  userCoordinates: [number,number] = [0,0];

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

  constructor(
    private gasStationService: GasStationService, 
    private userService: UserService, 
    private geoService: GeoService, 
    private gasStationStateService: GasStationStateService)
  {
    this.isAuthenticated = this.userService.isAuthenticated();    
  }

  ngOnInit(): void {
    const savedState = this.gasStationStateService.getGasStationsState();
    if (savedState) {
      this.location = savedState.location;      
      this.fuel = savedState.fuel;      
      this.ngOnChanges();
      this.gasStationStateService.clearState();
    }
  }

  ngOnChanges():void {
    if (this.location) {
      this.geoService.getCoordinates(this.location).subscribe((data) => {      
        if (data && data.length > 0) {        
          this.userCoordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          this.location = this.formatLocation(this.location);
          if(this.location && this.fuel){
            this.gasStationStateService.setGasStationsState({
              location: this.location,
              fuel: this.fuel
            }); 
            this.getGasStationsByLocationAndFuel(this.location, this.fuel);
            this.updateDisplayedColumns();
          }
          else{
            this.getGasStationsbyLocation(this.location);
            this.displayedColumns = ['marca', 'direccion', 'localidad', 'horario', 'diesel', 'dieselPremium', 'gasolina95', 'gasolina98', 'distance', 'travelTime', 'fecha'];
          }        
        }
      });
    }
  }

  updateDisplayedColumns(): void {
    const fuelColumns = this.fuel
      .map(fuelType => this.fuelMapping[fuelType])
      .filter(column => column);
    this.displayedColumns = ['marca', 'direccion', 'localidad', 'horario', ...fuelColumns, 'distance','travelTime', 'fecha'];
  }

  getGasStationsbyLocation(location: string): void{
    this.locationIndication = true;
    this.isLoading = true;
    this.gasStationService.getGasStationByLocation(location).subscribe(
      (data) => {
        this.isSearched = true;
        this.isLoading = false;
        /*setTimeout(() => {
          this.isLoading = false;
        }, 500);*/
        
        if(data.length === 0){
          this.message = 'No se han encontrado gasolineras en esta población. Por favor, pruebe con otra población.';
          this.gasStations = [];
        }
        else{
          this.gasStations = data;
          this.gasStations = this.gasStationService.addDistance(this.gasStations, this.userCoordinates);
          this.gasStations = this.gasStationService.addTravelTime(this.gasStations);     
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
        this.isLoading = false;
        /*setTimeout(() => {
          this.isLoading = false;
        }, 500);*/
        
        if(data.length === 0){
          this.message = 'No se han encontrado gasolineras en esta población. Por favor, pruebe con otra población y/o seleccione otro tipo de combustible.';
          this.gasStations = [];
        }
        else{
          this.gasStations = data;
          this.gasStations = this.gasStationService.addDistance(this.gasStations, this.userCoordinates);
          this.gasStations = this.gasStationService.addTravelTime(this.gasStations);
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

    this.gasStations = data.sort((a, b) => {
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
        case 'distance':
          return this.compare(a.distance, b.distance, isAsc);
        case 'travelTime':
          return this.compare(a.travelTime, b.travelTime, isAsc);
        default:
          return 0;
      }
    });
  }

  private compare(a: number, b: number, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = './assets/images/Defecto.webp';
  }

}

