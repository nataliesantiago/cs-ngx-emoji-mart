import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
<<<<<<< HEAD
import { HistorialUsuarioComponent } from './historial-usuario/historial-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';
=======
import {AdPreguntasComponent} from './ad-preguntas/ad-preguntas.component';
import { from } from 'rxjs';
import { BuzonSugerenciasComponent } from './buzon-sugerencias/buzon-sugerencias.component';
>>>>>>> andres-spring-uno

export const AppRoutes: Routes = [
  {
    path: '',
    component: PaginaBlancoComponent, canActivate: [AuthGuard],
  },
<<<<<<< HEAD
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'home/:data', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard] }
=======
  { path: 'search', component: SearchComponent },
  { path: 'search/:id', component: SearchComponent },
  { path: 'ad-preguntas', component: AdPreguntasComponent },
  { path: 'sugerencias', component: BuzonSugerenciasComponent }
>>>>>>> andres-spring-uno
];
