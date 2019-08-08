import { Component, ViewChild, Input } from '@angular/core';
import { AutenticationService } from './services/autenticacion.service';
import { ResponseSearch } from './models/response-search';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private responseSearch: ResponseSearch) {
    this.responseSearch.setActive(true);
  }
}
