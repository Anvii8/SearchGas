import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationService } from 'src/app/Services/gas-station.service';
import * as leaflet from 'leaflet';
import { GeoService } from 'src/app/Services/geo.service';


@Component({
  selector: 'app-gas-station-details',
  templateUrl: './gas-station-details.component.html',
  styleUrls: ['./gas-station-details.component.css']
})
export class GasStationDetailsComponent implements OnInit, AfterViewInit {
  gasStation!: GasStationDTO;
  private map!: leaflet.Map;
  private markers: leaflet.Marker[] = [];
  private initCoordinates: [number, number] = [40.463667, -3.74922];
  private userCoordinates!: [number, number];
  private userIcon = leaflet.icon({
    iconUrl: './assets/leaflet/marker-user.png',
    iconSize: [41, 41]
  });

  constructor(
    private gasStationService: GasStationService, 
    private activatedRoute: ActivatedRoute, 
    private router: Router, 
    private geoService: GeoService)
  {}

  ngOnInit(): void {
    const identifier = this.activatedRoute.snapshot.paramMap.get('id');

    this.gasStationService.getGasStationById(parseInt(identifier!)).subscribe(
      (gasStation) => {
        this.gasStation = gasStation;
        this.updateMapLocation(this.gasStation.localidad);
        this.addMapGasStation(this.gasStation);
      },
      (error) => {
        console.error('Error al obtener la información de la gasolinera', error);
      }
    );
  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  createMap(): void {
    this.map = leaflet.map('map2').setView(this.initCoordinates, 6);
    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map); 
  }

  addMapGasStation(gasStation: GasStationDTO): void {
    if (gasStation.latitud && gasStation.longitud) {
      const lat = parseFloat(gasStation.latitud.replace(',', '.'));
      const lon = parseFloat(gasStation.longitud.replace(',', '.'));
      const marker = leaflet.marker([lat, lon]).addTo(this.map).bindPopup(`<b>${gasStation.marca}</b><br>${gasStation.direccion}`);
      this.markers.push(marker);
    }
  }

  updateMapLocation(location: string): void {
    this.geoService.getCoordinates(location).subscribe((data) => {      
      if (data && data.length > 0) {        
        this.userCoordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        this.map.setView(this.userCoordinates, 13);
        const usermarker = leaflet.marker(this.userCoordinates,{icon: this.userIcon}).addTo(this.map).bindPopup(`ESTOY AQUÍ`);
        this.markers.push(usermarker);
      }
    });
  }


}
