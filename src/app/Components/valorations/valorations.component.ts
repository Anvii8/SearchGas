import { Component, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ValorationsDTO } from 'src/app/Models/valorations.dto';
import { ValorationsService } from 'src/app/Services/valorations.service';

@Component({
  selector: 'app-valorations',
  templateUrl: './valorations.component.html',
  styleUrls: ['./valorations.component.css']
})
export class ValorationsComponent implements OnInit {
  comentario: string = "";
  hoverStars: number = 0;
  selectedStars: number = 0;
  haveValorations: boolean = false;
  valorations: ValorationsDTO[] = [];
  @Input() gasStationId!: number;
  average: number = 0;

  constructor(private valorationsService: ValorationsService){}

  ngOnInit(): void {
    this.getValorations(this.gasStationId);
  }

  getValorations(gasStationId: number): void {
    if(gasStationId){
      this.valorationsService.getValorationsByGasStation(gasStationId).subscribe(
        (valorations) => {
          this.haveValorations = valorations.length !== 0;
          this.valorations = valorations;
        },
        (error) => {
          console.error('Error al obtener la valoraciones', error);
        }
      )
    }
  }

  getRatingIcons(rating: number): string[] {
    const icons: string[] = [];
    for (let i = 1; i <= 5; i++) {
      icons.push(i <= rating ? 'star' : 'star_border');
    }
    return icons;
  }

  getAverageRating(): number {
    if (this.valorations.length === 0) {
      return 0;
    }
    const totalRating = this.valorations.reduce((sum, val) => sum + val.rating, 0);
    return totalRating / this.valorations.length;
  }

  getAverageRatingIcons(): string[] {
    this.average = this.getAverageRating();
    const icons: string[] = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(this.average)) {
        icons.push('star');
      } else if (i - this.average < 1) {
        icons.push('star_half');
      } else {
        icons.push('star_border');
      }
    }
    return icons;
  } 
  
  voteFavorite(star: number): void{
    this.selectedStars = star;
  }

  addValoration(comentarioInput: NgModel): void{
    const userId = localStorage.getItem('user_id');
    this.valorationsService.addValoration(userId!, this.gasStationId, this.selectedStars, this.comentario).subscribe(
      () => 
        {
          this.getValorations(this.gasStationId);
          this.selectedStars = 0;
          this.comentario =  '';
          comentarioInput.control.markAsPristine();
          comentarioInput.control.markAsUntouched();
        }
    );
  }

}
