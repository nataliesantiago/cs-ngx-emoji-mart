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
  permitir_envio = true;
  editar = false;
  id_encuesta;
  id_usuario;
  orden_preguntas = [];

  constructor(private ajax: AjaxService, private userService: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {

    this.user = this.userService.getUsuario();
    if (this.user) {
      this.id_usuario = this.user.idtbl_usuario;
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      this.id_usuario = u.idtbl_usuario;
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

    this.route.params
      .filter(params => params.id_encuesta)
      .subscribe(params => {
        
        {order: "popular"}
        this.id_encuesta = params.id_encuesta;
        
    });

    if(this.id_encuesta != "nuevo"){
      this.editar = true;
      this.ajax.get('encuestas/obtener-ind', { idtbl_encuesta: this.id_encuesta }).subscribe(d => {
        if(d.success){
          this.encuesta = d.encuesta[0];
          this.ajax.get('encuestas/obtener-preguntas', { id_encuesta: d.encuesta[0].idtbl_encuesta }).subscribe(d2 => {
            if(d2.success){              
              this.preguntas = d2.preguntas;
              for(let i = 1; i <= d2.preguntas.length; i++){
                this.orden_preguntas.push({valor: i});
              }
            }
          })
        }
      })
    }

  }

  ngOnInit() {
  }

  anadirPregunta(){
    this.preguntas.push({ enunciado: '', id_tipo: '', peso: '', minimo: '', maximo: '', orden: ''});
    this.orden_preguntas.push({ valor: this.preguntas.length});
  }

  eliminarPregunta(e, pos){

    swal.fire({
      title: 'Eliminar Pregunta',
      text: "Confirme para eliminar la pregunta",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.preguntas.splice(pos, 1);
        this.cg.detectChanges();
      }
    })
    
  }

  reiniciarValores(e){
    e.minimo = '';
    e.maximo = '';
  }

  validarDato(e){
    if(e.minimo == ''){
      e.minimo = 0;
    }
    if(e.maximo < e.minimo){
      swal.fire({
        title: 'Dato Incorrecto',
        text: 'Debe digitar un valor mayor al minimo',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
      });
      this.permitir_envio = false;
    }else if (e.maximo == e.minimo){
      swal.fire({
          title: 'Dato Incorrecto',
          text: 'Debe digitar un valor diferente al minimo',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept',
          confirmButtonText: 'Aceptar',
      })
      this.permitir_envio = false;
    }else{
      this.permitir_envio = true;
    }
    this.cg.detectChanges();
  }

  enviarDato(){
    let suma_total = 0;
    let validar_orden = true;
    let validar_campos = true;
    console.log(this.permitir_envio);
    if(this.permitir_envio){

      if(this.preguntas.length == 0){
        swal.fire({
          title: 'Dato Incorrecto',
          text: 'Debe ingresr al menos una pregunta antes de guardar',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept',
          confirmButtonText: 'Aceptar',
      })
      }else{
        for(let i = 0; i < this.preguntas.length; i++){
          
          suma_total = this.preguntas[i].peso + suma_total;
          
          if(this.preguntas[i].orden == ""){
            validar_orden = false;
          }
          if(this.preguntas[i].id_tipo != 1 && this.preguntas[i].id_tipo != 5){
            this.preguntas[i].minimo = null;
            this.preguntas[i].maximo = null;
          }
          if(this.preguntas[i].id_tipo == 1){
            if(this.preguntas[i].minimo == "" || this.preguntas[i].maximo == ""){
              validar_campos = false;
            }
          }
          if(this.preguntas[i].id_tipo == 5){
            if(this.preguntas[i].maximo == ""){
              validar_campos = false;
            }
          }
          if(this.preguntas[i].enunciado == "" || this.preguntas[i].id_tipo == ""){
            validar_campos = false;
          }
          
        }
        for(let i = 0; i < this.preguntas.length; i++){
          for(let j = i + 1; j < this.preguntas.length; j++){
            if(this.preguntas[i].orden == this.preguntas[j].orden){
              validar_orden = false;
            }
          }
        }

        if(this.encuesta.nombre == "" || this.encuesta.id_tipo_encuesta == ""){
          validar_campos = false;
        }

        if(validar_campos){
          if(validar_orden){
            if(suma_total == 100){
              if(this.editar){
                this.ajax.post('encuestas/editar', { encuesta: this.encuesta, preguntas: this.preguntas, id_usuario: this.user.idtbl_usuario }).subscribe(d => {
                  if(d.success){
                    
                    this.router.navigate(['/ad-encuestas']);
                  }
                })
              }else{
                this.ajax.post('encuestas/guardar', { encuesta: this.encuesta, preguntas: this.preguntas, id_usuario: this.user.idtbl_usuario }).subscribe(d => {
                  if(d.success){
                    
                    this.router.navigate(['/ad-encuestas']);
                  }
                })
              }
              
            }else if(suma_total < 100){
              swal.fire({
                title: 'Peso incorrecto',
                text: 'La sumatoria del peso de las preguntas es menor a 100, ajuste los valores antes de guardar',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'custom__btn custom__btn--accept',
                confirmButtonText: 'Aceptar',
            })  
            }else if (suma_total > 100){
              swal.fire({
                title: 'Peso incorrecto',
                text: 'La sumatoria del peso de las preguntas es mayor a 100, ajuste los valores antes de guardar',
                type: 'warning',
                buttonsStyling: false,
                confirmButtonClass: 'custom__btn custom__btn--accept',
                confirmButtonText: 'Aceptar',
            })
            }
          }else{
            swal.fire({
              title: 'Orden Incorrecto',
              text: 'Seleccione el orden de las preguntas adecuadamente',
              type: 'warning',
              buttonsStyling: false,
              confirmButtonClass: 'custom__btn custom__btn--accept',
              confirmButtonText: 'Aceptar',
          })
          }
        }else{
          swal.fire({
            title: 'Datos Incompletos',
            text: 'Digite todos los campos en el formulario',
            type: 'warning',
            buttonsStyling: false,
            confirmButtonClass: 'custom__btn custom__btn--accept',
            confirmButtonText: 'Aceptar',
        })
        }
        
        
      }
    }else{
      swal.fire({
        title: 'Datos Incorrectos',
        text: 'Verifique que todos los valores sean correctos',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
    })
    }

  }

}
