import { Routes } from '@angular/router';
import { PlanetListComponent } from './components/planet-list/planet-list.component';
import { PlanetDetailComponent } from './components/planet-detail/planet-detail.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/planets',
    pathMatch: 'full'
  },
  {
    path: 'planets',
    component: PlanetListComponent
  },
  {
    path: 'planets/:id',
    component: PlanetDetailComponent
  }
];