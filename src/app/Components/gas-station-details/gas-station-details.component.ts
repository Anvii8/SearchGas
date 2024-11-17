import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { GasStationService } from 'src/app/Services/gas-station.service';
import * as leaflet from 'leaflet';
import { GeoService } from 'src/app/Services/geo.service';
import { Location } from '@angular/common';
import { FavoritesService } from 'src/app/Services/favorites.service';
import { FavoritesDTO } from 'src/app/Models/favorites.dto';


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
  favorites: FavoritesDTO[] = [];
  userId: string | null;
  gasStationId: number;


  constructor(
    private gasStationService: GasStationService, 
    private activatedRoute: ActivatedRoute, 
    private location: Location, 
    private geoService: GeoService,
    private favoritesService: FavoritesService
  )
  {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.gasStationId = parseInt(id!);
    this.userId = localStorage.getItem('user_id');
    this.loadFavorites();
  }

  ngOnInit(): void {
    this.gasStationService.getGasStationById(this.gasStationId).subscribe(
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
      const marker = leaflet.marker([gasStation.latitud, gasStation.longitud]).addTo(this.map).bindPopup(`<b>${gasStation.marca}</b><br>${gasStation.direccion}`);
      this.markers.push(marker);
    }
  }

  updateMapLocation(location: string): void {
    this.geoService.getCoordinates(location).subscribe((data) => {      
      if (data && data.length > 0) {        
        this.userCoordinates = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        [this.gasStation] = this.gasStationService.addDistance([this.gasStation], this.userCoordinates);
        [this.gasStation] = this.gasStationService.addTravelTime([this.gasStation]);
        this.map.setView(this.userCoordinates, 13);
        const usermarker = leaflet.marker(this.userCoordinates,{icon: this.userIcon}).addTo(this.map).bindPopup(`ESTOY AQUÍ`);
        this.markers.push(usermarker);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  loadFavorites() {
    this.favoritesService.getUserFavorites(this.userId!).subscribe(
      (favorites) => {
        this.favorites = favorites;
      },
      (error) => console.error('Error loading favorites:', error)
    );
  }

  toggleFavorite(gasStationId: number) {
    if (this.isFavorite(gasStationId)) {
      this.favoritesService.removeFavorite(this.userId!, gasStationId).subscribe(() => {
        this.loadFavorites();
        this.isFavorite(gasStationId);
      });
    } else {
      this.favoritesService.addFavorite(this.userId!, gasStationId).subscribe(() => {
        this.loadFavorites();
        this.isFavorite(gasStationId);
      });
    }
  }

  isFavorite(gasStationId: number): boolean {
    if(this.favorites.length === 0){
      return false;
    }
    return this.favorites.some((fav) =>  fav.gasStation.id === gasStationId);
  }
}
