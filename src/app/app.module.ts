import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './Components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GasStationListComponent } from './Components/gas-station-list/gas-station-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SearchFieldComponent } from './Components/search-field/search-field.component';
import { HomeComponent } from './Components/home/home.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { HeaderComponent } from './Components/header/header.component';
import {MatButtonModule} from '@angular/material/button';
import { FooterComponent } from './Components/footer/footer.component';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { RegisterComponent } from './Components/register/register.component';
import { MapComponent } from './Components/map/map.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationDialogComponent } from './Components/notification-dialog/notification-dialog.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FavoritesComponent } from './Components/favorites/favorites.component';
import { GasStationDetailsComponent } from './Components/gas-station-details/gas-station-details.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import { ValorationsComponent } from './Components/valorations/valorations.component';
import { PrivacyInformationComponent } from './Components/privacy-information/privacy-information.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GasStationListComponent,
    SearchFieldComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    MapComponent,
    NotificationDialogComponent,
    FavoritesComponent,
    GasStationDetailsComponent,
    ValorationsComponent,
    PrivacyInformationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatTabsModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
