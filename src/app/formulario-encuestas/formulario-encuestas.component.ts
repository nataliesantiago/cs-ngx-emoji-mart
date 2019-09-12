import { Component, OnInit, ViewChild , ChangeDetectorRef, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { QuillEditorComponent } from 'ngx-quill';
import { QuillService } from '../providers/quill.service';

@Component({
  selector: 'app-formulario-encuestas',
  templateUrl: './formulario-encuestas.component.html',
  styleUrls: ['./formulario-encuestas.component.scss']
})
export class FormularioEncuestasComponent implements OnInit {

  encuesta = { nombre: '', id_tipo_encuesta: '' };
  tipo_pregunta = [];
  tipo_encuesta = [];
  preguntas = [];
  user;

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {

    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.init();
      }
    })
  }

  init(){

    this.ajax.get('encuestas/obtener-tipo', { tipo: 1 }).subscribe(d => {
      if(d.success){        
        this.tipo_encuesta = d.tipo;
      }
    })

    this.ajax.get('encuestas/obtener-tipo', { tipo: 2 }).subscribe(d => {
      if(d.success){
        
        this.tipo_pregunta = d.tipo;
      }
    })

  }

  ngOnInit() {
  }

}
