import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { HeaderView } from 'src/app/Models/header-view.dto';
import { GasStationStateService } from 'src/app/Services/gas-station-state.service';
import { GasStationService } from 'src/app/Services/gas-station.service';
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
  allLocations: string[] = [];
  filteredLocations!: Observable<string[]>;
  
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
  
  constructor(private headerMenusService: HeaderViewService, private gasStationStateService: GasStationStateService, private gasStationService: GasStationService){
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.geoAccepted = false;
  }

  ngOnInit(): void {
    this.gasStationService.getAllLocations().subscribe(data => {
      data.sort((a, b) => a.localeCompare(b));   
      this.allLocations = data

      this.filteredLocations = this.locationFormControl.valueChanges.pipe(
        startWith(''),
        map((value) => this.filterLocations(value || ''))
      );
    });
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderView) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
          if(this.showAuthSection){
            const savedState = this.gasStationStateService.getGasStationsState();
            if(savedState){   
              this.locationFormControl.setValue(savedState.location);
              this.dieselControl.setValue(savedState.fuel[0]);
              this.gasControl.setValue(savedState.fuel[1]);
            }
          }
          this.searchForm.updateValueAndValidity();
        }
      }
    );
  }

  private filterLocations(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allLocations.filter((location) =>
      location.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if(this.showAuthSection){
      if (this.searchForm.valid) {
        const diesel = this.dieselControl.value || [];
        const gas = this.gasControl.value || [];
        const fuel: string[] = [...diesel, ...gas];         
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
    const fuel2: string[] = [...diesel, ...gas];

    
    if ((!diesel && !gas) || (diesel.length == 0 && gas.length == 0)) {
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
