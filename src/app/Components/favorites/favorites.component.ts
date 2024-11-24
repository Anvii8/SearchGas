import { Component } from '@angular/core';
import { FavoritesDTO } from 'src/app/Models/favorites.dto';
import { GasStationDTO } from 'src/app/Models/gas-station.dto';
import { FavoritesService } from 'src/app/Services/favorites.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  favorites: FavoritesDTO[] = [];
  gasStationsfavorites: GasStationDTO[] = [];
  userId: string | null;
  favoritesIsEmpty: boolean = true;

  constructor(private favoritesService: FavoritesService){
    this.userId = localStorage.getItem('user_id');
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoritesService.getUserFavorites(this.userId!).subscribe(
      (favorites) => {
        this.favorites = favorites;
        if(this.favorites.length === 0){
          this.favoritesIsEmpty = true;
        } else{
          this.favoritesIsEmpty = false;
          this.gasStationsfavorites = this.favorites.map((fav) => fav.gasStation);  
        }
      },
      (error) => console.error('Error loading favorites:', error)
    );
  }

  removeFavorite(gasStationId: number) {
    this.favoritesService.removeFavorite(this.userId!, gasStationId).subscribe(() => {
      this.loadFavorites();
    });
  }

  getFuelPrices(gasStation: GasStationDTO) {    
    return [
        { type: 'Diesel', price: gasStation.preciodiesel },
        { type: 'Diesel Premium', price: gasStation.preciodieselpremium },
        { type: 'Gasolina 95', price: gasStation.preciogasolina95 },
        { type: 'Gasolina 98', price: gasStation.preciogasolina98 }
    ].filter(fuel => fuel.price != 0.000);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = './assets/images/Defecto.webp';
  }

}
