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
  pregunta = { titulo: '', respuesta: '', id_producto: '', id_usuario: '', id_usuario_ultima_modificacion: '', id_estado: 3, id_estado_flujo: 4 };
  usuario;
  id_usuario;
  id_pregunta_editar;
  editar = false;
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
              console.log(this.pregunta);
            }
          })
        }
      }
    })

  }

  guardarPregunta(){

    if(this.editar){
      console.log(this.id_usuario);
      console.log(this.pregunta);
      this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
      this.ajax.post('preguntas/editar', { pregunta: this.pregunta }).subscribe(d => {
        if(d.success){
          console.log("guardó editar");
          this.router.navigate(['/administrador-preguntas']);
        }
      })
    }else{
      console.log(this.id_usuario);
      console.log(this.pregunta);
      this.pregunta.id_estado_flujo = 4;
      this.pregunta.id_usuario = this.id_usuario;
      this.pregunta.id_usuario_ultima_modificacion = this.id_usuario;
      this.ajax.post('preguntas/guardar', { pregunta: this.pregunta }).subscribe(d => {
        if(d.success){
          console.log("guardó");
          this.router.navigate(['/administrador-preguntas']);
        }
      })
    }

    
  }

}
