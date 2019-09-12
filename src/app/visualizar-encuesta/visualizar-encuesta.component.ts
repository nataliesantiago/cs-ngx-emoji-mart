import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';

@Component({
  selector: 'app-visualizar-encuesta',
  templateUrl: './visualizar-encuesta.component.html',
  styleUrls: ['./visualizar-encuesta.component.scss']
})
export class VisualizarEncuestaComponent implements OnInit {

  user;
  id_tipo_encuesta;
  encuesta = [];
  preguntas = [];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService){
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

    this.route.params
      .filter(params => params.tipo_encuesta)
      .subscribe(params => {
        
        {order: "popular"}
        this.id_tipo_encuesta = params.tipo_encuesta;
        
    });

    this.ajax.get('encuestas/obtener-encuesta-tipo', { id_tipo: this.id_tipo_encuesta }).subscribe(d => {
      if(d.success){
        this.encuesta = d.encuesta[0];
        this.ajax.get('encuestas/obtener-preguntas', { id_encuesta: d.encuesta[0].idtbl_encuesta }).subscribe(d2 => {
          if(d2.success){              
            this.preguntas = d2.preguntas;              
          }
        })
      }
    })

  }

  ngOnInit() {
  }

}
