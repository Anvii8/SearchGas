import { AfterViewInit, Component } from '@angular/core';
import * as leaflet from 'leaflet';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GeoService } from 'src/app/Services/geo.service';

leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: './assets/leaflet/marker-icon-2x.png',
  iconUrl: './assets/leaflet/marker-icon.png',
  shadowUrl: './assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements AfterViewInit{
  private map!: leaflet.Map;
  private initCoordinates: [number, number] = [40.463667, -3.74922];
  private userCoordinates!: [number, number];
  private markers: leaflet.Marker[] = [];

  private userIcon = leaflet.icon({
    iconUrl: './assets/leaflet/marker-user.png',
    iconSize: [41, 41]
  });

  constructor(private geoService: GeoService) {}

  private initMap(): void {
    this.map = leaflet.map('map').setView(this.initCoordinates, 6);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);  
  }

  ngAfterViewInit(): void {
    this.initMap();
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

  addMapGasStations(gasStations: GasStationDTO[]): void {
    this.clearMarkers();
    gasStations.forEach(station => {
      if (station.latitud && station.longitud) {
        const marker = leaflet.marker([station.latitud, station.longitud]).addTo(this.map).bindPopup(`<b>${station.marca}</b><br>${station.direccion}`);
        this.markers.push(marker);
      }
    });
  }

  resetMapView(): void {
    this.clearMarkers();
    this.map.setView(this.initCoordinates, 6);
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker)); 
    this.markers = [];
  }

}
