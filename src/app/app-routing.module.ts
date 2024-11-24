import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { HomeComponent } from './Components/home/home.component';
import { RegisterComponent } from './Components/register/register.component';
import { FavoritesComponent } from './Components/favorites/favorites.component';
import { AuthGuard } from './Guards/auth.guard';
import { GasStationDetailsComponent } from './Components/gas-station-details/gas-station-details.component';
import { PrivacyInformationComponent } from './Components/privacy-information/privacy-information.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'aboutUs', component: PrivacyInformationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuard] },
  { path: 'gasStation/:id', component: GasStationDetailsComponent, canActivate: [AuthGuard] },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
