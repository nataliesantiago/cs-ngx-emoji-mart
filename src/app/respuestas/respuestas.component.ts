import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrls: ['./respuestas.component.scss']
})
export class RespuestasComponent implements OnInit {

  id_pregunta_visualizar;
  id_usuario;
  usuario;
  pregunta :   any;
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

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef) {

    this.usuario = user.getUsuario();
    console.log(this.usuario);
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        console.log("funciona");
        console.log(d.usuario[0].idtbl_usuario);
        this.id_usuario = d.usuario[0].idtbl_usuario;        
      }
    })

   }

  ngOnInit() {

    this.route.queryParams
      .filter(params => params.id_pregunta)
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.id_pregunta_visualizar = params.id_pregunta;
        console.log(this.id_pregunta_visualizar); // popular
      });
    
    this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.pregunta[0]);
        this.pregunta = p.pregunta[0];
        this.pregunta.id_usuario = p.pregunta[0].id_usuario_creacion;
        this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sr => {
          if(sr.success){
            console.log("funciona subrespuesta");
            console.log(sr.subrespuesta);
            this.subrespuestas = sr.subrespuesta;                
            console.log(this.subrespuestas);
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
            console.log(this.categorias_subrespuestas_superior);
            console.log(this.categorias_subrespuestas_inferior);
            this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sg => {
              if(sg.success){
                console.log("funciona segmentos");
                console.log(sg.segmentos);
                this.segmentos = sg.segmentos;
                for(let i = 0; i < this.segmentos.length; i++){
                  this.segmentos[i].respuesta = this.segmentos[i].texto;
                }
                console.log(this.segmentos);
                this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(srsg => {
                  if(srsg.success){
                    console.log("funciona segmentos");
                    console.log(srsg.subrespuestaSegmento);
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
                    console.log(this.array_mostrar);
                    this.ajax.get('preguntas/obtener-preguntas-asociadas', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(pras => {
                      if(pras.success){
                        console.log("funciona");
                        console.log(pras.preguntas_asociadas);
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
        console.log(this.pregunta);
      }
    })

  }

  preguntaAsociada(e){
    this.router.navigate(['/respuestas'], {queryParams: {id_pregunta: e}});
    this.pregunta = [];
    this.subrespuestas = [];
    this.segmentos = [];
    this.array_mostrar = [];
    this.preguntas_adicion = [];
    this.content;
    this.categorias_subrespuestas_superior = [];
    this.categorias_subrespuestas_inferior = [];
    this.id_pregunta_visualizar = e;
    this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(p => {
      if(p.success){
        console.log("funciona");
        console.log(p.pregunta[0]);
        this.pregunta = p.pregunta[0];
        this.pregunta.id_usuario = p.pregunta[0].id_usuario_creacion;
        this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sr => {
          if(sr.success){
            console.log("funciona subrespuesta");
            console.log(sr.subrespuesta);
            this.subrespuestas = sr.subrespuesta;                
            console.log(this.subrespuestas);
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
            console.log(this.categorias_subrespuestas_superior);
            console.log(this.categorias_subrespuestas_inferior);
            this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(sg => {
              if(sg.success){
                console.log("funciona segmentos");
                console.log(sg.segmentos);
                this.segmentos = sg.segmentos;
                for(let i = 0; i < this.segmentos.length; i++){
                  this.segmentos[i].respuesta = this.segmentos[i].texto;
                }
                console.log(this.segmentos);
                this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(srsg => {
                  if(srsg.success){
                    console.log("funciona segmentos");
                    console.log(srsg.subrespuestaSegmento);
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
                    console.log(this.array_mostrar);
                    this.ajax.get('preguntas/obtener-preguntas-asociadas', { idtbl_pregunta: this.id_pregunta_visualizar }).subscribe(pras => {
                      if(pras.success){
                        console.log("funciona");
                        console.log(pras.preguntas_asociadas);
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
        console.log(this.pregunta);
      }
    })
  }

  calificacion(valor){
    this.nueva_observacion = true;
    this.valor_calificacion = valor;
  }

  enviarCalificacion(){
    this.ajax.post('preguntas/observaciones-respuesta', { comentario: this.observaciones, positivo: this.valor_calificacion, id_usuario: this.id_usuario, id_pregunta: this.id_pregunta_visualizar }).subscribe(d => {
      if(d.success){
        console.log("guardó editar");
        if(this.valor_calificacion == 2){
          swal.fire({
            title: '¿Deseas buscar un experto?',
            text: "",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si'
          }).then((result) => {
            if (result.value) {
              swal.fire(  
                'Supongamos que se abre el chat',
              )
            }
          })  
        }else{
          this.router.navigate(['/home']);
        }  
      }
    })
  }

}
