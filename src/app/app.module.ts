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
import { HomeComponent } from './home/home.component';
import { SpeechRecognizerService } from './home/web-speech/shared/services/speech-recognizer.service';
import { SpeechSynthesizerService } from './home/web-speech//shared/services/speech-synthesizer.service';

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
import { GoogleLoginProvider } from 'angularx-social-login';
import { environment } from '../environments/environment';
import { PaginaBlancoComponent } from './pagina-blanco/pagina-blanco.component';

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.CLIENT_ID)
  }
]);

export function provideConfig() {
  return config;
}

/* import { AuthGuard } from './services/guards/auth.guard';
import { RoleGuard } from './services/guards/role.guard';
import { TokenInterceptor } from './services/interceptors/token.interceptor';
import { AuthInterceptor } from './services/interceptors/auth.interceptor';
 */
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
    PerfectScrollbarModule,
    RouterModule.forRoot(AppRoutes),
    AutocompleteLibModule,
    SocialLoginModule,
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
      useFactory: provideConfig,
    },
    //models
    ResponseSearch,
    SpeechRecognizerService,
    SpeechSynthesizerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
