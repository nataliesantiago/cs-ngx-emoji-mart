import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { AppComponent } from '../app.component';
import { EventEmitter } from '@angular/core';
import { ResponseSearch } from '../models/response-search';

@Component({
  selector: 'app-pagina-blanco',
  templateUrl: './pagina-blanco.component.html',
  styleUrls: ['./pagina-blanco.component.scss']
})
export class PaginaBlancoComponent implements OnInit {

  constructor(private responseSearch: ResponseSearch) {
    this.responseSearch.setActive(true);
  }

  ngOnInit() {
  }

}
