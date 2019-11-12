import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { ResponseSearch } from '../models/response-search';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-blanco',
  templateUrl: './pagina-blanco.component.html',
  styleUrls: ['./pagina-blanco.component.scss']
})
export class PaginaBlancoComponent implements OnInit {

  constructor(private responseSearch: ResponseSearch, private router: Router) {
    this.responseSearch.setActive(true);
    
    if (localStorage.getItem('token') && localStorage.getItem('token') != '') {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    

  }

}
