import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseSearch } from '../models/response-search';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  resultado: boolean = false;
  busqueda: String;
  valorBusqueda: String;
  ortografia: boolean = false;
  busquedaCorregida: String;
  resultadosBus;
  respuesta = new ResponseSearch;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    debugger;
    //this.respuesta.setResultados("");
    this.resultadosBus = this.respuesta.getResultados();
    console.log('Este es el array', this.resultadosBus);
    console.log(this.resultadosBus);
    if(this.resultadosBus !== '' && this.resultadosBus.length !== 0){
      this.resultado = true;
    }
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
