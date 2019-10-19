import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SearchComponent } from './search/search.component';
import { BuzonSugerenciasComponent } from './buzon-sugerencias/buzon-sugerencias.component';
import { HomeComponent } from './home/home.component';
import { SpeechRecognizerService } from './home/web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from './home/web-speech//shared/services/speech-synthesizer.service';
import { QuillModule } from 'ngx-quill';
import { Ng2SmartTableModule } from 'ngx-smart-table';
import { ColorBlockModule } from 'ngx-color/block';

import { AdPreguntasComponent } from "./ad-preguntas/ad-preguntas.component";
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { ResponseSearch } from './models/response-search';
import { HistorialUsuarioComponent } from './historial-usuario/historial-usuario.component';
import { AutenticationService } from './services/autenticacion.service';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';
import { AjaxService } from './providers/ajax.service';
import { HistorialUsuariosService } from './providers/historial-usuarios.service';
import { ChatClienteComponent } from './components/chat-cliente/chat-cliente.component';
import { HomeProComponent } from './home-pro/home-pro.component';
import { UserService } from './providers/user.service';
import { AppSearchComponent } from './components/search/search.component';
import { SearchService } from './providers/search.service';
import { from } from 'rxjs';
import { FormularioPreguntasComponent } from './formulario-preguntas/formulario-preguntas.component';
import { TreeComponent } from "./forms/tree/treecomponent";
import { HighlightPipe } from './home/highlight.pipe';
import { AppBlankComponent } from './layouts/blank/blank.component';
import { AutosizeDirective } from '../directives/autosize.directive';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { FechaChatPipe } from '../pipes/fecha-chat.pipe';
import { SortDatePipe } from '../pipes/sort.date';
import { ChatExpertoComponent } from './chat-experto/chat-experto.component';
import { ChatService } from './providers/chat.service';
import { MatSelectModule, MatListOption, MatListModule, MatDividerModule } from '@angular/material';
import { ScrollDirective } from '../directives/scroll.directive';
import { MinuteSecondsPipe } from '../directives/minutes.pipe';
import { AsociarPreguntasComponent } from './asociar-preguntas/asociar-preguntas.component';
import { FlujoCuraduriaComponent } from './flujo-curaduria/flujo-curaduria.component';
import { FormularioPreguntasFlujoCuraduriaComponent } from './formulario-preguntas-flujo-curaduria/formulario-preguntas-flujo-curaduria.component';
import { RespuestasComponent } from './respuestas/respuestas.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { UrlsUsuarioComponent } from './urls-usuario/urls-usuario.component';
import { QuillService } from './providers/quill.service';
import { SonidosComponent } from './components/sonidos/sonidos.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ReplaceEmojisPipe } from '../pipes/emojis.pipe';
import { AdminsitradorExtensionesChatComponent } from './adminsitrador-extensiones-chat/adminsitrador-extensiones-chat.component';
import { FormularioProductosComponent } from './formulario-productos/formulario-productos.component';

import { MatTreeModule } from '@angular/material/tree';
import { CreacionProductosComponent } from './creacion-productos/creacion-productos.component';
import { MensajeClientePipe } from '../pipes/mensaje-cliente.pipe';
import { MensajesExpertoPipe } from '../pipes/mensajes-experto.pipe';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IntencionesChatComponent } from './intenciones-chat/intenciones-chat.component';
import { UtilsService } from './providers/utils.service';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TransferenciaChatComponent } from './components/transferencia-chat/transferencia-chat.component';
import { ExpertosActivosePipe } from '../pipes/expertos-activos.pipe';
import { FormularioEncuestasComponent } from './formulario-encuestas/formulario-encuestas.component';
import { AdEncuestasComponent } from './ad-encuestas/ad-encuestas.component';
import { VisualizarEncuestaComponent } from './visualizar-encuesta/visualizar-encuesta.component';
import { TiempoColaPipe } from '../pipes/tiempo-cola.pipe';
import { AdExpertizComponent } from './ad-expertiz/ad-expertiz.component';
import { FormularioExpertizComponent } from './formulario-expertiz/formulario-expertiz.component';
import { AdCategoriaExperticiaComponent } from './ad-categoria-experticia/ad-categoria-experticia.component';
import { FormularioCategoriaExperticiaComponent } from './formulario-categoria-experticia/formulario-categoria-experticia.component';
import { FilaChatsPipe } from '../pipes/fila-chats.pipe';
import { AdExpertosComponent } from './ad-expertos/ad-expertos.component';
import { FormularioExpertoComponent } from './formulario-experto/formulario-experto.component';
import { AdministradorShortcutsComponent } from './administrador-shortcuts/administrador-shortcuts.component';
import { ShortcutsService } from './providers/shortcuts.service';
import { AdministradorGuionesComponent } from './administrador-guiones/administrador-guiones.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AdministradorNotificacionesComponent } from './administrador-notificaciones/administrador-notificaciones.component';
import { FormularioNotificacionesComponent } from './formulario-notificaciones/formulario-notificaciones.component';
import { AdMotivoCierreChatComponent } from './ad-motivo-cierre-chat/ad-motivo-cierre-chat.component';
import { CargaMasivaComponent, DialogOverviewDetailQuestion } from './carga-masiva/carga-masiva.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SosComponent } from './components/sos/sos.component';
import { MomentDate } from '../pipes/momentDate';
import { OnlyNumberDirective } from '../common/onlyNumberDirective';
import { SosOperadorComponent } from './components/sos-operador/sos-operador.component';
import { LinkifyPipe } from '../pipes/linkify.pipe';
import { SafePipe } from './pipes/safe.pipe';
import { AdministradorLookFeelComponent } from './administrador-look-feel/administrador-look-feel.component';
import { CerrarChatExpertoComponent } from './components/cerrar-chat-experto/cerrar-chat-experto.component';
import { ReplaceEmojisMensajePipe } from '../pipes/emoji.mensaje.pipe';
import { OrdenarExpertosPipe } from '../pipes/ordenar-expertos.pipe';
import { TransitionGroupItemDirective, TransitionGroupComponent } from '../directives/sort.animation.directives';
import { AdMensajesAutomaticosComponent } from './ad-mensajes-automaticos/ad-mensajes-automaticos.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AppSidebarComponent,
    SearchComponent,
    HomeComponent,
    HistorialUsuarioComponent,
    PaginaBlancoComponent,
    ChatClienteComponent,
    AdPreguntasComponent,
    BuzonSugerenciasComponent,
    HomeProComponent,
    AppSearchComponent,
    FormularioPreguntasComponent,
    HighlightPipe,
    AppBlankComponent,
    AutosizeDirective,
    FechaChatPipe,
    SortDatePipe,
    ChatExpertoComponent,
    ScrollDirective,
    MinuteSecondsPipe,
    AsociarPreguntasComponent,
    FlujoCuraduriaComponent,
    FormularioPreguntasFlujoCuraduriaComponent,
    RespuestasComponent,
    AdministracionComponent,
    CategoriasComponent,
    UrlsUsuarioComponent,
    SonidosComponent,
    ReplaceEmojisPipe,
    AdminsitradorExtensionesChatComponent,
    CreacionProductosComponent,
    FormularioProductosComponent,
    MensajeClientePipe,
    MensajesExpertoPipe,
    IntencionesChatComponent,
    SafeHtmlPipe,
    TransferenciaChatComponent,
    ExpertosActivosePipe,
    FormularioEncuestasComponent,
    AdEncuestasComponent,
    VisualizarEncuestaComponent,
    TiempoColaPipe,
    FilaChatsPipe,
    AdExpertizComponent,
    FormularioExpertizComponent,
    AdCategoriaExperticiaComponent,
    FormularioCategoriaExperticiaComponent,
    AdExpertosComponent,
    FormularioExpertoComponent,
    DialogOverviewDetailQuestion,
    AdministradorShortcutsComponent,
    AdministradorGuionesComponent,
    AdministradorNotificacionesComponent,
    FormularioNotificacionesComponent,
    CargaMasivaComponent,
    AdMotivoCierreChatComponent,
    SosComponent,
    MomentDate,
    OnlyNumberDirective,
    SosOperadorComponent,
    LinkifyPipe,
    SafePipe,
    AdministradorLookFeelComponent,
    CerrarChatExpertoComponent,
    ReplaceEmojisMensajePipe,
    OrdenarExpertosPipe,
    TransitionGroupItemDirective,
    TransitionGroupComponent,
    AdMensajesAutomaticosComponent
  ],
  entryComponents: [
    TransferenciaChatComponent,
    DialogOverviewDetailQuestion,
    SosComponent,
    SosOperadorComponent,
    CerrarChatExpertoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    MatTreeModule,
    /*QuillModule.forRoot({modules: {
      syntax: true,
      toolbar: {
        container: [['bold', 'italic'],        // toggled buttons
    
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
    
        ['link', 'image', 'video'],],
      }
    }}),*/
    QuillModule,
    PerfectScrollbarModule,
    RouterModule.forRoot(AppRoutes, { useHash: true }),
    AutocompleteLibModule,
    SocialLoginModule,
    Ng2SmartTableModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    PickerModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    ColorBlockModule
  ],

  providers: [
    {
      provide: AuthServiceConfig,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    //models
    ResponseSearch,
    SpeechRecognizerService,
    SpeechSynthesizerService,
    AjaxService,
    UserService,
    HistorialUsuariosService,
    SearchService,
    ChatService,
    QuillService,
    UtilsService,
    ShortcutsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }