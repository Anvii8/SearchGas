import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GasStationStateService {
  private gasStationsState: any = null;

  setGasStationsState(state: any) {
    this.gasStationsState = state;
  }

  getGasStationsState() {
    return this.gasStationsState;
  }

  clearState() {
    this.gasStationsState = null;
  }
}
