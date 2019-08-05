import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  resultado = true;
  busqueda: String;
  valorBusqueda: String;
  ortografia = false;
  busquedaCorregida: String;
  resultadosBus;
  respuesta: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public responseSearch: ResponseSearch,
    private homeService: HomeService,
  ) {
    this.responseSearch.setActiveMostrarBarra(true);
    this.resultadosBus = this.responseSearch.getResultados();
    console.log('Este es el array', this.resultadosBus);
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.busqueda = params.get('id');
      console.log('Esta es la palabra de busqueda ' + this.busqueda);
      if (this.busqueda !== undefined && this.busqueda !== null && this.busqueda !== '') {
        if (this.busqueda === 'omo') {
          this.ortografia = true;
          this.busquedaCorregida = 'como';
        }
      } else {
        this.busqueda = 'Vacio';
      }
      this.valorBusqueda = this.busqueda;
    });
    if (this.resultadosBus !== undefined && this.resultadosBus !== null && this.resultadosBus.length !== 0) {
      if (this.resultadosBus !== '') {
        this.resultado = true;
      } else {
        this.resultado = false;
      }
    } else {
      this.homeService.autocompleteText(this.busqueda).subscribe((data) => {
        this.resultadosBus = data.data;
        if (typeof data.data !== "undefined") {
          if (data.data.length !== 0) {
            this.resultado = true;
          } else {
            this.resultado = false;
          }
        } else {
          this.resultado = false;
        }
      }
      );
    }
  }
  resultados() {
    const valor = window.btoa(this.valorBusqueda.toString());
    console.log(valor);
  }
  buscar() {
    console.log('Esta es la busqueda ' + this.valorBusqueda);
    this.router.navigate(['/search/' + this.valorBusqueda]);
  }

}
