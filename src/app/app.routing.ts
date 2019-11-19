import { Routes } from '@angular/router';
import { ResultadosComponent } from './resultados/resultados.component';
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
import { AdministradorShortcutsComponent } from './administrador-shortcuts/administrador-shortcuts.component';
import { AdministradorGuionesComponent } from './administrador-guiones/administrador-guiones.component';
import { AdministradorNotificacionesComponent } from './administrador-notificaciones/administrador-notificaciones.component';
import { FormularioNotificacionesComponent } from './formulario-notificaciones/formulario-notificaciones.component';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { AdMotivoCierreChatComponent } from './ad-motivo-cierre-chat/ad-motivo-cierre-chat.component';
import { AdministradorLookFeelComponent } from './administrador-look-feel/administrador-look-feel.component';
import { AdministradorUsuariosComponent } from './administrador-usuarios/administrador-usuarios.component';
import { FormularioUsuariosComponent } from './formulario-usuarios/formulario-usuarios.component';
import { ConsolaSupervisorComponent } from './consola-supervisor/consola-supervisor.component';
import { AdMensajesAutomaticosComponent } from './ad-mensajes-automaticos/ad-mensajes-automaticos.component';
import { AdEstadoExpertoComponent } from './ad-estado-experto/ad-estado-experto.component';
import { AdministradorOrigenesDriveComponent } from './administrador-origenes-drive/administrador-origenes-drive.component';
import { HistorialChatComponent } from './historial-chat/historial-chat.component';
import { AdministradorHorariosComponent } from './administrador-horarios/administrador-horarios.component';
import { AdminsitracionRolesComponent } from './adminsitracion-roles/adminsitracion-roles.component';





export const AppRoutes: Routes = [
  { path: '', component: PaginaBlancoComponent, canActivate: [AuthGuard], data: { bypass: true } },
  { path: 'valida/:data', component: PaginaBlancoComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { bypass: true } },
  { path: 'home/:abrir', component: HomeComponent, canActivate: [AuthGuard], data: { bypass: true } },
  { path: 'search', component: ResultadosComponent, canActivate: [AuthGuard], data: { bypass: true } },
  { path: 'historial-usuario', component: HistorialUsuarioComponent, canActivate: [AuthGuard], data: { modulo: 1 } },
  { path: 'ad-expertos', component: AdExpertosComponent, canActivate: [AuthGuard], data: { modulo: 12 } },
  { path: 'administrador-usuarios', component: AdministradorUsuariosComponent, canActivate: [AuthGuard], data: { modulo: 20 } },
  { path: 'administrador-notificaciones', component: AdministradorNotificacionesComponent, canActivate: [AuthGuard], data: { modulo: 13 } },
  { path: 'formulario-notificaciones/:id_notificacion', component: FormularioNotificacionesComponent, canActivate: [AuthGuard], data: { modulo: 13 } },
  { path: 'respuestas/:id_pregunta', component: RespuestasComponent, canActivate: [AuthGuard], data: { bypass: true } },
  { path: 'administracion', component: AdministracionComponent, canActivate: [AuthGuard], data: { modulo: 5 } },
  { path: 'administracion-horarios', component: AdministradorHorariosComponent, canActivate: [AuthGuard], data: { modulo: 25 } },
  { path: 'flujo-curaduria', component: FlujoCuraduriaComponent, canActivate: [AuthGuard], data: { modulo: 3 } },
  { path: 'admin/menu/urls', component: UrlsUsuarioComponent, canActivate: [AuthGuard], data: { modulo: 18 } },
  { path: 'categorias', component: CreacionProductosComponent, canActivate: [AuthGuard], data: { modulo: 13 } },
  { path: 'ad-encuestas', component: AdEncuestasComponent, canActivate: [AuthGuard], data: { modulo: 9 } },
  { path: 'ad-expertiz', component: AdExpertizComponent, canActivate: [AuthGuard], data: { modulo: 10 } },
  { path: 'formulario-expertiz/:id_expertiz', component: FormularioExpertizComponent, canActivate: [AuthGuard], data: { modulo: 10 } },
  { path: 'ad-categoria-expertiz', component: AdCategoriaExperticiaComponent, canActivate: [AuthGuard], data: { modulo: 11 } },
  { path: 'formulario-categoria-expertiz/:id_categoria_expertiz', component: FormularioCategoriaExperticiaComponent, canActivate: [AuthGuard], data: { modulo: 11 } },
  { path: 'formulario-ad-experto/:id_experto', component: FormularioExpertoComponent, canActivate: [AuthGuard], data: { modulo: 12 } },
  { path: 'formulario-administracion-usuarios/:id_usuario', component: FormularioUsuariosComponent, canActivate: [AuthGuard], data: { modulo: 20 } },
  { path: 'formulario-productos', component: FormularioProductosComponent, canActivate: [AuthGuard], data: { modulo: 6 } },
  { path: 'formulario-encuestas/:id_encuesta', component: FormularioEncuestasComponent, canActivate: [AuthGuard], data: { modulo: 9 } },
  { path: 'formulario-preguntas-flujo-curaduria/:id_pregunta', component: FormularioPreguntasFlujoCuraduriaComponent, canActivate: [AuthGuard], data: { modulo: 4 } },
  { path: 'admin/preguntas', component: AdPreguntasComponent, canActivate: [AuthGuard], data: { modulo: 2 } },
  { path: 'formulario_pregunta/:id_pregunta', component: FormularioPreguntasComponent, canActivate: [AuthGuard], data: { modulo: 2 } },
  { path: 'chat-experto', component: ChatExpertoComponent, canActivate: [AuthGuard], data: { modulo: 26 } },
  { path: 'consola-supervisor', component: ConsolaSupervisorComponent, canActivate: [AuthGuard], data: { modulo: 27 } },
  { path: 'consola-supervisor/:id_conversacion', component: ConsolaSupervisorComponent, canActivate: [AuthGuard], data: { modulo: 27 } },
  { path: 'admin/chat/extensiones', component: AdminsitradorExtensionesChatComponent, canActivate: [AuthGuard], data: { modulo: 7 } },
  { path: 'admin/chat/intenciones', component: IntencionesChatComponent, canActivate: [AuthGuard], data: { modulo: 8 } },
  { path: 'carga-masiva', component: CargaMasivaComponent, canActivate: [AuthGuard], data: { modulo: 16 } },
  { path: 'administrador-shortcuts', component: AdministradorShortcutsComponent, canActivate: [AuthGuard], data: { modulo: 15 } },
  { path: 'administrador-guiones', component: AdministradorGuionesComponent, canActivate: [AuthGuard], data: { modulo: 14 } },
  { path: 'motivo-cierre-chat', component: AdMotivoCierreChatComponent, canActivate: [AuthGuard], data: { modulo: 17 } },
  { path: 'administrar-look-feel', component: AdministradorLookFeelComponent, canActivate: [AuthGuard], data: { modulo: 19 } },
  { path: 'ad-mensajes-automaticos', component: AdMensajesAutomaticosComponent, canActivate: [AuthGuard], data: { modulo: 21 } },
  { path: 'ad-estado-experto', component: AdEstadoExpertoComponent, canActivate: [AuthGuard], data: { modulo: 22 } },
  { path: 'administrar-origenes-drive', component: AdministradorOrigenesDriveComponent, canActivate: [AuthGuard], data: { modulo: 23 } },
  { path: 'historial-chats', component: HistorialChatComponent, canActivate: [AuthGuard], data: { modulo: 24 } },
  { path: 'historial-chats/:id_conversacion', component: HistorialChatComponent, canActivate: [AuthGuard], data: { modulo: 24 } },
  { path: 'administracion-roles', component: AdminsitracionRolesComponent, canActivate: [AuthGuard], data: { modulo: 28 } },
];
