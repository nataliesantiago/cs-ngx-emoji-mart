import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buzon-sugerencias',
  templateUrl: './buzon-sugerencias.component.html',
  styleUrls: ['./buzon-sugerencias.component.css']
})
export class BuzonSugerenciasComponent implements OnInit {

  nombres: String;
  apellidos: String;
  email: String;
  sugerencia: String = '';

  constructor() {
  }

  ngOnInit() {
  }

}
