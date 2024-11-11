import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { HeaderView } from 'src/app/Models/header-view.dto';
import { HeaderViewService } from 'src/app/Services/header-view.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
})
export class SearchFieldComponent implements OnInit{
  locationFormControl = new FormControl('');
  dieselControl = new FormControl('');
  gasControl = new FormControl('');

  showAuthSection: boolean;
  showNoAuthSection: boolean;
  geoAccepted: boolean;
  geolocationUser: [number, number] = [0, 0];

  @Output() locationSelected = new EventEmitter<string>();
  @Output() fuelSelected = new EventEmitter<string[]>();
  @Output() geolocationSelected = new EventEmitter<[number, number]>();

  typesDiesel: string[] = ["Diesel", "Diesel Premium"];
  typesGas: string[] = ["Gasolina 95", "Gasolina 98"];

  searchForm = new FormGroup(
    {
        locationFormControl: this.locationFormControl,
        dieselControl: this.dieselControl,
        gasControl: this.gasControl
    },
    { validators: [this.atLeastOneSelected, this.atLeastOneSelectedLocation.bind(this)] }
);
  
  constructor(private headerMenusService: HeaderViewService){
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.geoAccepted = false;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderView) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
          this.searchForm.updateValueAndValidity();
        }
      }
    );
  }

  onSubmit() {
    if(this.showAuthSection){
      if (this.searchForm.valid) {
        const diesel = this.dieselControl.value;
        const gas = this.gasControl.value;
        const fuel = [diesel, gas].filter((value): value is string => value !== null && value !== undefined);
        if(this.geoAccepted){
          this.geolocationSelected.emit(this.geolocationUser);
        }
        else{
          const location = this.locationFormControl.value;
          this.locationSelected.emit(location!);
        }
        this.fuelSelected.emit(fuel);
      } else {
        this.searchForm.markAllAsTouched();
      }
    } else{
      if (this.locationFormControl.valid) {
        const location = this.locationFormControl.value;
        this.locationSelected.emit(location!);
      }
    }
  }

  private atLeastOneSelected(control: AbstractControl): ValidationErrors | null {
    const diesel = control.get('dieselControl')?.value;
    const gas = control.get('gasControl')?.value;

    if (!diesel && !gas) {
        return { atLeastOneRequired: true };
    }
    return null;
  }

  private atLeastOneSelectedLocation(control: AbstractControl): ValidationErrors | null {
    const loc = control.get('locationFormControl')?.value;

    if (this.showAuthSection) {
      if (!loc && !this.geoAccepted) {
        return { atLeastOneSelectedLocation: true };
      }
      else if(loc && this.geoAccepted){
        return { bothSelectedLocation: true };
      }
    } else {
      if (!loc) {
        return { locationNeeded: true };
      }
    }
    return null;
  }

  geolocation(): void {
    this.geoAccepted = !this.geoAccepted;
    if (this.geoAccepted) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.geolocationUser = [position.coords.latitude, position.coords.longitude];
          this.searchForm.updateValueAndValidity();
        },
        (error) => {
          this.geoAccepted = false;
          console.error('No se ha podido geolocalizar al usuario', error);
          this.searchForm.updateValueAndValidity();
        }
      );
    } else {
      this.geolocationUser = [0, 0];
      this.searchForm.updateValueAndValidity();
    }
  }
}
