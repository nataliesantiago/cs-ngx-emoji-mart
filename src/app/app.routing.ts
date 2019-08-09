import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { HistorialUsuarioComponent } from './historial-usuario/historial-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';
import { HomeProComponent } from './home-pro/home-pro.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: PaginaBlancoComponent, canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home-pro', component: HomeProComponent, canActivate: [AuthGuard] },
  { path: 'home/:data', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard] }
];
