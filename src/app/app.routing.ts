import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { HomeComponent } from './home/home.component';
import { HistorialUsuarioComponent } from './historial-usuario/historial-usuario.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';
import { HomeProComponent } from './home-pro/home-pro.component';
import { AdPreguntasComponent } from './ad-preguntas/ad-preguntas.component';
import { from } from 'rxjs';
import { BuzonSugerenciasComponent } from './buzon-sugerencias/buzon-sugerencias.component';
import { FormularioPreguntasComponent } from './formulario-preguntas/formulario-preguntas.component';
import { ChatExpertoComponent } from './chat-experto/chat-experto.component';
import { AsociarPreguntasComponent } from './asociar-preguntas/asociar-preguntas.component';
import { FlujoCuraduriaComponent } from './flujo-curaduria/flujo-curaduria.component';
import { FormularioPreguntasFlujoCuraduriaComponent } from './formulario-preguntas-flujo-curaduria/formulario-preguntas-flujo-curaduria.component';
import { RespuestasComponent } from './respuestas/respuestas.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { UrlsUsuarioComponent } from './urls-usuario/urls-usuario.component';

export const AppRoutes: Routes = [
  { path: '', component: PaginaBlancoComponent, canActivate: [AuthGuard] },
  { path: 'valida/:data', component: PaginaBlancoComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home-pro', component: HomeProComponent, canActivate: [AuthGuard] },
  { path: 'home/:data', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent },
  { path: 'search/:id', component: SearchComponent },
  { path: 'ad-preguntas', component: AdPreguntasComponent },
  { path: 'respuestas', component: RespuestasComponent },
  { path: 'asociar-preguntas', component: AsociarPreguntasComponent },
  { path: 'administrador', component: AdministracionComponent },
  { path: 'flujo-curaduria', component: FlujoCuraduriaComponent },
  { path: 'administracion-urls', component: UrlsUsuarioComponent },
  { path: 'formulario-preguntas-flujo-curaduria', component: FormularioPreguntasFlujoCuraduriaComponent },
  { path: 'sugerencias', component: BuzonSugerenciasComponent },
  { path: 'administrador-preguntas', component: AdPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'formulario_pregunta', component: FormularioPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'chat-experto', component: ChatExpertoComponent, canActivate: [AuthGuard] }
];
