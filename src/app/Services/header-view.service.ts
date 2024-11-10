import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderView } from '../Models/header-view.dto';

@Injectable({
  providedIn: 'root'
})
export class HeaderViewService {
  headerManagement: BehaviorSubject<HeaderView> = new BehaviorSubject<HeaderView>({
    showAuthSection: false,
    showNoAuthSection: true,
  });
}
