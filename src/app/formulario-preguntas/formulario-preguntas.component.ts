import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-formulario-preguntas',
  templateUrl: './formulario-preguntas.component.html',
  styleUrls: ['./formulario-preguntas.component.scss']
})
export class FormularioPreguntasComponent implements OnInit {

  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: '', id_estado_flujo: 4, muestra_fecha_actualizacion: 0};
  segmentos = [];
  subrespuestas = [];
  subrespuestas_segmentos = [];
  usuario;
  id_usuario;
  id_pregunta_editar;
  editar = false;
  estados_pregunta;
  cant_segmentos = 0;
  cant_subrespuestas = 0;
  arr = Array;
  cant_subrespuestas_segmento = 0;
  array_mostrar = [];

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router) { 
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

        this.id_pregunta_editar = params.id_pregunta;
        console.log(this.id_pregunta_editar); // popular
      });

    this.ajax.get('producto/obtener', { }).subscribe(d => {
      if(d.success){
        console.log("funciona");
        console.log(d.productos);
        this.productos = d.productos;
        if(this.id_pregunta_editar){
          this.editar = true;
          this.ajax.get('preguntas/obtenerInd', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(p => {
            if(p.success){
              console.log("funciona");
              console.log(p.pregunta[0]);
              this.pregunta = p.pregunta[0];
              this.pregunta.id_usuario = p.pregunta[0].id_usuario_creacion;
              this.ajax.get('preguntas/obtener-subrespuesta', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(sr => {
                if(sr.success){
                  console.log("funciona subrespuesta");
                  console.log(sr.subrespuesta);
                  this.subrespuestas = sr.subrespuesta;   
                  for(let i = 0; i < this.segmentos.length; i++){
                    this.subrespuestas[i].respuesta = this.subrespuestas[i].texto;
                  }               
                  console.log(this.subrespuestas);
                  this.ajax.get('preguntas/obtener-segmentos', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(sg => {
                    if(sg.success){
                      console.log("funciona segmentos");
                      console.log(sg.segmentos);
                      this.segmentos = sg.segmentos;
                      for(let i = 0; i < this.segmentos.length; i++){
                        this.segmentos[i].respuesta = this.segmentos[i].texto;
                      }
                      console.log(this.segmentos);
                      this.ajax.get('preguntas/obtener-subrespuesta-segmentos', { idtbl_pregunta: this.id_pregunta_editar }).subscribe(srsg => {
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
      }
    })

    this.ajax.get('estado-pregunta/obtener', { }).subscribe(d => {
      if(d.success){
        console.log("funciona");
        console.log(d.estados_pregunta);
        this.estados_pregunta = d.estados_pregunta;
      }
    })

  }

  guardarPregunta(){

    if(this.editar){
      console.log(this.id_usuario);
      console.log(this.pregunta);
      if(this.pregunta.muestra_fecha_actualizacion){
        this.pregunta.muestra_fecha_actualizacion = 1;
      }else{
        this.pregunta.muestra_fecha_actualizacion = 0;
      }
      console.log("editada", this.pregunta);
      this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
      for(let i = 0; i < this.array_mostrar.length; i++){
        this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
      }
      this.ajax.post('preguntas/editar', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar }).subscribe(d => {
        if(d.success){
          console.log("guardó editar");
          this.router.navigate(['/administrador-preguntas']);
        }
      })
    }else{
      console.log(this.id_usuario);
      console.log(this.pregunta);
      if(this.pregunta.muestra_fecha_actualizacion){
        this.pregunta.muestra_fecha_actualizacion = 1;
      }else{
        this.pregunta.muestra_fecha_actualizacion = 0;
      }
      this.pregunta.id_estado_flujo = 4;
      this.pregunta.id_usuario = this.id_usuario;
      this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
      for(let i = 0; i < this.array_mostrar.length; i++){
        this.array_mostrar[i].segmento = this.segmentos[this.array_mostrar[i].pos_segmento].titulo;
      }
      console.log(this.array_mostrar);
      this.ajax.post('preguntas/guardar', { pregunta: this.pregunta, segmentos: this.segmentos, subrespuestas: this.subrespuestas, subrespuestas_segmentos: this.array_mostrar }).subscribe(d => {
        if(d.success){
          console.log("guardó");
          this.router.navigate(['/administrador-preguntas']);
        }
      })
    }

    
  }

  anadirSegmento(){
    this.segmentos.push({ titulo: '', respuesta: ''});
  }

  anadirSubRespuesta(){
    this.subrespuestas.push({ titulo: '', respuesta: ''});
  }

  eliminarSegmento(){
    this.cant_segmentos = this.cant_segmentos - 1;
    this.segmentos.pop();
  }

  eliminarSubRespuesta(){
    this.cant_subrespuestas = this.cant_subrespuestas - 1;
    this.subrespuestas.pop();
  }

  validarSegmento(e){
    /*this.array_mostrar = [];
    this.cant_subrespuestas_segmento = 0;
    for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/
  }

  anadirSubRespuestaSegmento(e){
    this.array_mostrar.push({ titulo: '', respuesta: '', pos_segmento: e, segmento: ''});
    console.log(this.array_mostrar);
    console.log(e);
    /*for(let i of this.subrespuestas_segmentos){
      if(i.pos_segmento == e){
        this.array_mostrar.push(i);
      }
    }*/
    //console.log(this.array_mostrar);
  }

  eliminarSubRespuestaSegmento(e){
    let ultimoregistro = 0;
    let cont = 0;
    for(let i of this.array_mostrar){
      if(i.pos_segmento == e){
        ultimoregistro = cont;
      }
      cont++;
    }
    console.log(ultimoregistro);
    this.array_mostrar.splice(ultimoregistro,1);
    console.log(this.array_mostrar);
  }

  mostrarEstado(){
    console.log(this.pregunta);
  }

}
