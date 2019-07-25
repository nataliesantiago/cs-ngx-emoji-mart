import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  resultadosBusqueda = [
    {
      id: 1, categoria: 'aperturas', origen: 'drive', titulo: "Como crear mi cuenta corriente", descripcion: 'Abrir una cuenta bancaria no es una operación complicada. Bien en las propias sucursales, bien a través de internet, contratar estos productos básicos en las finanzas personales es realmente sencillo aunque, es cierto que deberemos seguir unos pasos para realizar la contratación de manera correcta. Las cuentas bancarias son el instrumento de uso cotidiano más proximo al usuario de a pie.Se trata de productos con los que mantenemos una relación constante y que no deben ser contratados a la ligera.', imagen: 'assets/davivienda.png'
    },
    { id: 2, categoria: 'creditos', origen: 'word', titulo: "Credito para mi casa nueva", descripcion: 'Hogares colombianos que deseen adquirir una vivienda urbana nueva en Colombia y que cumplan con las siguientes características', imagen: null },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.busqueda = params.get('id');
      console.log('Esta es la palabra de busqueda ' + this.busqueda);
      if (this.busqueda !== undefined && this.busqueda !== null && this.busqueda !== '') {
        this.resultado = true;
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
