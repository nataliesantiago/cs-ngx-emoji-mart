import { Component, OnInit } from '@angular/core';
import { AjaxService } from '../../providers/ajax.service';
import { UserService } from '../../providers/user.service';

@Component({
  selector: 'app-ad-preguntas',
  templateUrl: './ad-preguntas.component.html',
  styleUrls: ['./ad-preguntas.component.css']
})
export class AdPreguntasComponent implements OnInit {

  productos = [];
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 3, id_estado_flujo: 4 };
  usuario;
  id_usuario;
  constructor(private ajax: AjaxService, private user: UserService) { 
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

    this.ajax.get('producto/obtener', { }).subscribe(d => {
      if(d.success){
        console.log("funciona");
        console.log(d.productos);
        this.productos = d.productos;
      }
    })

  }

  guardarPregunta(){
    console.log(this.id_usuario);
    console.log(this.pregunta);
    this.pregunta.id_estado_flujo = 4;
    this.pregunta.id_usuario = this.id_usuario;
    this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
    this.ajax.post('preguntas/guardar', { pregunta: this.pregunta }).subscribe(d => {
      if(d.success){
        console.log("guardó");
      }
    })

  }

}
