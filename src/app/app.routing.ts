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
import { AdminsitradorExtensionesChatComponent } from './adminsitrador-extensiones-chat/adminsitrador-extensiones-chat.component';
import { CreacionProductosComponent } from './creacion-productos/creacion-productos.component';
import { FormularioProductosComponent } from './formulario-productos/formulario-productos.component';
import { IntencionesChatComponent } from './intenciones-chat/intenciones-chat.component';
import { FormularioEncuestasComponent } from './formulario-encuestas/formulario-encuestas.component';
import { AdEncuestasComponent } from './ad-encuestas/ad-encuestas.component';
import { VisualizarEncuestaComponent } from './visualizar-encuesta/visualizar-encuesta.component';
import { AdExpertizComponent } from './ad-expertiz/ad-expertiz.component';
import { FormularioExpertizComponent } from './formulario-expertiz/formulario-expertiz.component';
import { AdCategoriaExperticiaComponent } from './ad-categoria-experticia/ad-categoria-experticia.component';
import { FormularioCategoriaExperticiaComponent } from './formulario-categoria-experticia/formulario-categoria-experticia.component';
import { AdExpertosComponent } from './ad-expertos/ad-expertos.component';
import { FormularioExpertoComponent } from './formulario-experto/formulario-experto.component';
import { MassLoadComponent } from './mass-load/mass-load.component';
import { AdministradorNotificacionesComponent } from './administrador-notificaciones/administrador-notificaciones.component';
import { FormularioNotificacionesComponent } from './formulario-notificaciones/formulario-notificaciones.component';


export const AppRoutes: Routes = [
  { path: '', component: PaginaBlancoComponent, canActivate: [AuthGuard] },
  { path: 'valida/:data', component: PaginaBlancoComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'home-pro', component: HomeProComponent, canActivate: [AuthGuard] },
  { path: 'home/:data', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'search/:id', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'ad-preguntas', component: AdPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'ad-expertos', component: AdExpertosComponent, canActivate: [AuthGuard] },
  { path: 'administrador-notificaciones', component: AdministradorNotificacionesComponent, canActivate: [AuthGuard] },
  { path: 'formulario-notificaciones/:id_notificacion', component: FormularioNotificacionesComponent, canActivate: [AuthGuard] },
  { path: 'respuestas/:id_pregunta', component: RespuestasComponent, canActivate: [AuthGuard] },
  { path: 'asociar-preguntas', component: AsociarPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard] },
  { path: 'flujo-curaduria', component: FlujoCuraduriaComponent, canActivate: [AuthGuard] },
  { path: 'admin/menu/urls', component: UrlsUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'administracion-urls', component: UrlsUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: CreacionProductosComponent, canActivate: [AuthGuard] },
  { path: 'ad-encuestas', component: AdEncuestasComponent, canActivate: [AuthGuard] },
  { path: 'ad-expertiz', component: AdExpertizComponent, canActivate: [AuthGuard] },
  { path: 'formulario-expertiz/:id_expertiz', component: FormularioExpertizComponent, canActivate: [AuthGuard] },
  { path: 'ad-categoria-expertiz', component: AdCategoriaExperticiaComponent, canActivate: [AuthGuard] },
  { path: 'formulario-categoria-expertiz/:id_categoria_expertiz', component: FormularioCategoriaExperticiaComponent, canActivate: [AuthGuard] },
  { path: 'formulario-ad-experto/:id_experto', component: FormularioExpertoComponent, canActivate: [AuthGuard] },
  { path: 'formulario-productos', component: FormularioProductosComponent, canActivate: [AuthGuard] },
  { path: 'formulario-encuestas/:id_encuesta', component: FormularioEncuestasComponent, canActivate: [AuthGuard] },
  { path: 'encuesta/:tipo_encuesta', component: VisualizarEncuestaComponent, canActivate: [AuthGuard] },
  { path: 'formulario-preguntas-flujo-curaduria/:id_pregunta', component: FormularioPreguntasFlujoCuraduriaComponent, canActivate: [AuthGuard] },
  { path: 'sugerencias', component: BuzonSugerenciasComponent, canActivate: [AuthGuard] },
  { path: 'admin/preguntas', component: AdPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'formulario_pregunta/:id_pregunta', component: FormularioPreguntasComponent, canActivate: [AuthGuard] },
  { path: 'chat-experto', component: ChatExpertoComponent, canActivate: [AuthGuard] },
  { path: 'admin/chat/extensiones', component: AdminsitradorExtensionesChatComponent, canActivate: [AuthGuard] },
  { path: 'admin/chat/intenciones', component: IntencionesChatComponent, canActivate: [AuthGuard] },
  { path: 'carga-masiva', component: MassLoadComponent, canActivate: [AuthGuard] },
];
