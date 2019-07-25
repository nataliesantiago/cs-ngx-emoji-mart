import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../services/home.service';
import { ResponseSearch } from '../models/response-search';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchText: string;
  myForm: FormControl;
  filteredOptions: Observable<any[]>;
  respuesta = new ResponseSearch;
  textopredictivo: any = [
  ];
  preguntasArray = [
    { id: 1, consulta: 'Como crear mi cuenta corriente' },
    { id: 2, consulta: 'Credito para mi casa nueva' },
    { id: 3, consulta: 'Beneficios del banco' },
    { id: 4, consulta: 'Davivienda desde tu celular' },
    { id: 5, consulta: 'Cuenta de ahorro para pensionados' },
    { id: 6, consulta: 'Puntos de atención' }
  ];
  busquedasArray = [
    { id: 1, busqueda: '¿Cuánto es el monto que puedo transferir desde mi cuenta Davivienda a Daviplata?' },
    { id: 2, busqueda: '¿Si soy cliente Davivienda, cuál es mi clave virtual o dónde la asigno?' },
    { id: 3, busqueda: '¿Cómo puedo presentar una queja o reclamo en Davivienda?' },
    { id: 4, busqueda: '¿como pedir un credito?' },
    { id: 5, busqueda: 'Adelanto de dinero desde mi app' }
  ];

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
    this.searchText = '';
  }
  keyword = 'title';
  selectEvent(item) {
    // do something with selected item
    debugger;
    this.searchText = item.title;
  }

  onChangeSearch(val: string) {
    this.searchText = val;
    this.homeService.autocompleteText(val).subscribe((data) =>
      this.textopredictivo = data.data
    );
  }
  ngOnInit(): void {
  }

  buscar() {
    console.log('Esta es la busqueda ' + this.searchText);
    if (this.searchText === null && this.searchText === undefined) {
      this.searchText = '';
    }
    this.respuesta.setResultados(this.textopredictivo);
    this.router.navigate(['/search/' + this.searchText]);
  }
}
