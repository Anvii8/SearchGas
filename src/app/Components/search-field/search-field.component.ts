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
  locationFormControl = new FormControl('', [Validators.required]);
  dieselControl = new FormControl('');
  gasControl = new FormControl('');

  showAuthSection: boolean;
  showNoAuthSection: boolean;

  @Output() locationSelected = new EventEmitter<string>();
  @Output() fuelSelected = new EventEmitter<string[]>();

  typesDiesel: string[] = ["Diesel", "Diesel Premium"];
  typesGas: string[] = ["Gasolina 95", "Gasolina 98"];

  searchForm = new FormGroup(
    {
        locationFormControl: this.locationFormControl,
        dieselControl: this.dieselControl,
        gasControl: this.gasControl
    },
    { validators: this.atLeastOneSelected }
);
  
  constructor(private headerMenusService: HeaderViewService){
    this.showAuthSection = false;
    this.showNoAuthSection = true;
  }

  ngOnInit(): void {
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderView) => {
        if (headerInfo) {
          this.showAuthSection = headerInfo.showAuthSection;
          this.showNoAuthSection = headerInfo.showNoAuthSection;
        }
      }
    );
  }

  onSubmit() {
    if(this.showAuthSection){
      if (this.searchForm.valid) {
        const location = this.locationFormControl.value;
        const diesel = this.dieselControl.value;
        const gas = this.gasControl.value;
        const fuel = [diesel, gas].filter((value): value is string => value !== null && value !== undefined);
        this.locationSelected.emit(location!);
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
}
