import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
import { ChatService } from '../providers/chat.service';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit {

  id_pregunta_visualizar;
  id_usuario;
  usuario;
  pregunta:any;
  subrespuestas = [];
  segmentos = [];
  array_mostrar = [];
  preguntas_adicion = [];
  content;
  categorias_subrespuestas_superior = [];
  categorias_subrespuestas_inferior = [];
  observaciones = "";
  nueva_observacion = false;
  valor_calificacion;
  boton = "Enviar";
  activadoSi = false;
  activadoNo = false;
  pregunta_nueva = false;
  dias_pregunta_nueva = 30;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private chatService: ChatService) {

    this.usuario = this.user.getUsuario();

    this.user.observableUsuario.subscribe(u => {
      if (u) {
        this.usuario = u;
        this.init();
      } else {
        delete this.usuario;
      }
    });

    route.params.subscribe(val => {
      if(this.usuario){
        this.init();
      }
    });

    this.ajax.get('administracion/obtener-cantidad-dias-pregunta-nueva').subscribe(r => {
      if(r.success){
        this.dias_pregunta_nueva = r.item[0].valor;
      }
    })

   }

  init(){

    this.route.params
      .filter(params => params.id_pregunta)
      .subscribe(params => {
        
        {order: "popular"}
        this.id_pregunta_visualizar = params.id_pregunta;
        
    });

    let fecha_actual = moment(new Date());
    
    this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(p => {
      if(p.success){
        
        p.pregunta[0].fecha_ultima_modificacion = moment(p.pregunta[0].fecha_ultima_modificacion).tz('America/Bogota').format('YYYY-MM-DD');

        this.pregunta = p.pregunta[0];

        let fecha_creacion = moment(p.pregunta[0].fecha_creacion).tz('America/Bogota');
        
        let diferencia_dias = fecha_actual.diff(fecha_creacion, 'days');

        if(diferencia_dias <= this.dias_pregunta_nueva){
          this.pregunta_nueva = true;
        }

        this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sr => {
          if(sr.success){
            
            this.subrespuestas = sr.subrespuesta;                
            
            for(let i = 0; i < this.subrespuestas.length; i++){
              let validador = 0;
              if(this.categorias_subrespuestas_superior.length == 0 && this.subrespuestas[i].posicion == 1){
                this.categorias_subrespuestas_superior.push({categoria: this.subrespuestas[i].categoria});
              }else{
                if(this.subrespuestas[i].posicion == 1){
                  for(let j = 0; j < this.categorias_subrespuestas_superior.length; j++){
                    if(this.subrespuestas[i].categoria == this.categorias_subrespuestas_superior[j].categoria){
                      validador++;
                    }
                  }
                  if(validador == 0){
                    this.categorias_subrespuestas_superior.push({categoria: this.subrespuestas[i].categoria});
                  }
                }
              }
            }

            for(let i = 0; i < this.subrespuestas.length; i++){
              let validador = 0;
              if(this.categorias_subrespuestas_inferior.length == 0 && this.subrespuestas[i].posicion == 2){
                this.categorias_subrespuestas_inferior.push({categoria: this.subrespuestas[i].categoria});
              }else{
                if(this.subrespuestas[i].posicion == 2){
                  for(let j = 0; j < this.categorias_subrespuestas_inferior.length; j++){
                    if(this.subrespuestas[i].categoria == this.categorias_subrespuestas_inferior[j].categoria){
                      validador++;
                    }
                  }
                  if(validador == 0){
                    this.categorias_subrespuestas_inferior.push({categoria: this.subrespuestas[i].categoria});
                  }
                }
              }
            }
            
            this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sg => {
              if(sg.success){
                
                this.segmentos = sg.segmentos;
                for(let i = 0; i < this.segmentos.length; i++){
                  this.segmentos[i].respuesta = this.segmentos[i].texto;
                }
                
                this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(srsg => {
                  if(srsg.success){
                    
                    this.array_mostrar = srsg.subrespuestaSegmento;
                    for(let i = 0; i < this.array_mostrar.length; i++){
                      this.array_mostrar[i].respuesta = this.array_mostrar[i].texto;
                      for(let j = 0; j < this.segmentos.length; j++){
                        if(this.array_mostrar[i].id_segmento == this.segmentos[j].idtbl_segmento){
                          this.array_mostrar[i].pos_segmento = j;
                          j = this.segmentos.length + 1;
                        }
                      }
                    }
                    
                    this.ajax.get('preguntas/obtener-preguntas-asociadas', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(pras => {
                      if(pras.success){
                        
                        this.preguntas_adicion = pras.preguntas_asociadas;
                        this.cg.detectChanges();       
                      }
                    })
                  }
                })
              }
            })
          }
        })
        
      }
    })

  }

  ngOnInit() {

  }

  preguntaAsociada(e){
    this.router.navigate(['/respuestas', e]);
  }

  calificacion(valor){
    this.nueva_observacion = true;
    this.valor_calificacion = valor;
    if(valor == 1){
      this.boton = "Enviar";
      this.activadoSi = true;
      this.activadoNo = false;
    }else{
      this.boton = "Buscar Experto";
      this.activadoNo = true;
      this.activadoSi = false;
    }
  }

  enviarCalificacion(){
    
    this.ajax.post('preguntas/observaciones-respuesta', { comentario: this.observaciones, positivo: this.valor_calificacion, id_usuario: this.usuario.idtbl_usuario, id_pregunta: this.id_pregunta_visualizar }).subscribe(d => {
      if(d.success){
        
        if(this.valor_calificacion == 2){
          swal.fire({
            title: '¿Deseas buscar un experto?',
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
              this.chatService.crearConversacion(this.pregunta.id_producto);
            }
          })  
        }else{
          this.router.navigate(['/home']);
        }  
      }
    })
  }

  validarPadding(muestra_fecha, pregunta_nueva){
    console.log(muestra_fecha);
    console.log(pregunta_nueva);
  }

}
