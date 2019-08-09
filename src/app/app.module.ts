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
import {BuzonSugerenciasComponent} from './buzon-sugerencias/buzon-sugerencias.component';
import { HomeComponent } from './home/home.component';
import { SpeechRecognizerService } from './home/web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from './home/web-speech//shared/services/speech-synthesizer.service';
import {QuillModule} from 'ngx-quill';
import { Ng2SmartTableModule } from 'ngx-smart-table';

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
    QuillModule,
    PerfectScrollbarModule,
    RouterModule.forRoot(AppRoutes),
    AutocompleteLibModule,
    SocialLoginModule,
    QuillModule,
    Ng2SmartTableModule,
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
    SearchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

