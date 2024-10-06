import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { GasStationListComponent } from '../gas-station-list/gas-station-list.component';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css'],
})
export class SearchFieldComponent {
  locationFormControl = new FormControl('', [Validators.required]);

  @Output() locationSelected = new EventEmitter<string>();

  //constructor(private gasStationComponent: GasStationListComponent){}

  onSubmit() {
    if (this.locationFormControl.valid) {
      const location = this.locationFormControl.value;
      this.locationSelected.emit(location!);

    }
  }
}
