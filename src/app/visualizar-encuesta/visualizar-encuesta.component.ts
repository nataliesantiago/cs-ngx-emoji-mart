import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { Conversacion } from '../../schemas/conversacion.schema';

@Component({
  selector: 'app-visualizar-encuesta',
  templateUrl: './visualizar-encuesta.component.html',
  styleUrls: ['./visualizar-encuesta.component.scss']
})
export class VisualizarEncuestaComponent implements OnInit {

  user;
  id_tipo_encuesta;
  encuesta: [];
  preguntas = [];
  respuestas = [];
  idtbl_encuesta;
  @Input() tipo_encuesta_componente: number; 
  @Input() chat: Conversacion;
  estilos_cliente = false;

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
    route.params.subscribe(val => {
      if(this.user){
        this.init();
      }
    });
  }

  init(){

  }

  ngOnInit() {
    this.route.params
      .filter(params => params.tipo_encuesta)
      .subscribe(params => {
        
        {order: "popular"}
        this.id_tipo_encuesta = params.tipo_encuesta;
        
    });
    console.log(this.tipo_encuesta_componente);
    console.log(this.chat);
    if(this.tipo_encuesta_componente){
      this.id_tipo_encuesta = this.tipo_encuesta_componente;
    }

    if(this.tipo_encuesta_componente == 1){
      this.estilos_cliente = true;
    }

    this.ajax.get('encuestas/obtener-encuesta-tipo', { id_tipo: this.id_tipo_encuesta }).subscribe(d => {
      if(d.success){
        this.encuesta = d.encuesta[0];
        this.idtbl_encuesta = d.encuesta[0].idtbl_encuesta;
        this.ajax.get('encuestas/obtener-preguntas', { id_encuesta: d.encuesta[0].idtbl_encuesta }).subscribe(d2 => {
          if(d2.success){              
            this.preguntas = d2.preguntas;
            for(let i = 0; i < this.preguntas.length; i++){
              this.preguntas[i].respuesta = '';
            }
            console.log(this.preguntas);
          }
        })
      }
    })
  }

  arrayOne(n: number, n2: number): any[] {
    let valor = n2 - n + 1;
    return Array(valor);
  }

  agregarRespuesta(pos, valor){
    this.preguntas[pos].respuesta = valor;
    console.log(this.preguntas);
  }

  activarBoton(respuesta, validador){
    return respuesta == validador;
  }

  validarEstrellasMayor(respuesta, valor){
    return respuesta >= valor;
  }

  validarEstrellasMenor(respuesta, valor){
    return respuesta < valor;
  }

  enviarFormulario(){
    this.ajax.post('encuestas/guardar-respuesta', { preguntas: this.preguntas, id_conversacion: this.chat.idtbl_conversacion, id_usuario: this.user.idtbl_usuario, id_encuesta: this.idtbl_encuesta }).subscribe(d => {
      if (d.success) {
        
      }else{
        
      }
    })
  }

}
