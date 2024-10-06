import { Component, Input } from '@angular/core';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationService } from 'src/app/Services/gas-station.service';

@Component({
  selector: 'app-gas-station-list',
  templateUrl: './gas-station-list.component.html',
  styleUrls: ['./gas-station-list.component.css']
})
export class GasStationListComponent {

  gasStations!: GasStationDTO[];

  @Input() location!: string;

  constructor(private gasStationService: GasStationService){}

  /*ngOnInit(): void {
    this.getGasStationsbyLocation('Martorell');
  }*/

  ngOnChanges() {
    if (this.location) {
      this.getGasStationsbyLocation(this.location);
    }
  }

  getGasStationsbyLocation(location: string): void{
    this.gasStationService.getGasStationByLocation(location).subscribe(
      (data) => {
        this.gasStations = data;
      },
      (error) => {
        console.error('Error al obtener las gasolineras de la ubicación', error);
      }
    )
  }

}

