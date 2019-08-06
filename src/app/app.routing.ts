import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FullComponent } from './layouts/full/full.component';
import { HomeComponent } from './home/home.component';
import {AdPreguntasComponent} from './ad-preguntas/ad-preguntas.component';
  import { from } from 'rxjs';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'search', component: SearchComponent },
  { path: 'search/:id', component: SearchComponent },
  { path: 'ad-preguntas', component: AdPreguntasComponent }
];
