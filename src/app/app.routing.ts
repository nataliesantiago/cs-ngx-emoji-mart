import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FullComponent } from './layouts/full/full.component';
import { HomeComponent } from './home/home.component';
import { HistorialUsuarioComponent } from './historial-usuario/historial-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent, canActivate: [AuthGuard],
  },
  { path: 'blank', component: PaginaBlancoComponent},
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard] }
];
