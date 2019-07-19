import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  preguntasArray =  [
    {id:1, consulta:"Como crear mi cuenta corriente"},
    {id:2, consulta:"Credito para mi casa nueva"},
    {id:3, consulta:"Beneficios del banco"},
    {id:4, consulta:"Davivienda desde tu celular"},
    {id:5, consulta:"Cuenta de ahorro para pensionados"},
    {id:6, consulta:"Puntos de atención"}
  ];

  busquedasArray =  [
    {id:1, busqueda:"¿Cuánto es el monto que puedo transferir desde mi cuenta Davivienda a Daviplata?"},
    {id:2, busqueda:"¿Si soy cliente Davivienda, cuál es mi clave virtual o dónde la asigno?"},
    {id:3, busqueda:"¿Cómo puedo presentar una queja o reclamo en Davivienda?"},
    {id:4, busqueda:"¿como pedir un credito?"},
    {id:5, busqueda:"Adelanto de dinero desde mi app"}
  ];



  constructor() { 

  }

  ngOnInit() {
  }

}
