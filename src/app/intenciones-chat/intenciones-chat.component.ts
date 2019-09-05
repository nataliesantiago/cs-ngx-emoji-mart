import { Component, OnInit } from '@angular/core';
import { IntencionChat, CategoriaExperticia } from '../../schemas/interfaces';
import { User } from '../../schemas/user.schema';
import { UserService } from '../providers/user.service';
import { ChatService } from '../providers/chat.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-intenciones-chat',
  templateUrl: './intenciones-chat.component.html',
  styleUrls: ['./intenciones-chat.component.scss']
})
export class IntencionesChatComponent implements OnInit {
  nueva_intencion: IntencionChat = { activo: true };
  user: User;
  creando_intencion = false;
  myControl = new FormControl();
  categorias: Array<CategoriaExperticia>;
  categoria: CategoriaExperticia;
  createControl = new FormControl();
  categoria_creando: CategoriaExperticia;
  intenciones: Array<IntencionChat>;
  constructor(private userService: UserService, private chatService: ChatService) {
    this.user = this.userService.getUsuario();
    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
      }
    });
  }
  init() {

    this.chatService.getCategoriasExperticia().then((c: Array<CategoriaExperticia>) => {
      this.categorias = c;
    });
  }
  ngOnInit() {
  }

  seleccionarCategoria(value) {
    this.categoria = value;
    this.myControl.setValue(value.nombre);
    this.getIntencionesCategoria(this.categoria.idtbl_categoria_experticia);
  }

  getIntencionesCategoria(id_categoria: number) {
    this.chatService.getIntencionesCategoriasExperticia(id_categoria).then(i => {
      this.intenciones = i;
    })
  }

  seleccionarCategoriaNueva(value) {
    console.log('Valor', value)
    this.categoria_creando = value;
    this.createControl.setValue(value.nombre);
  }

  crearIntencion() {
    this.nueva_intencion.nombre_categoria = this.categoria_creando.nombre;
    this.nueva_intencion.id_categoria_experticia = this.categoria_creando.idtbl_categoria_experticia;
    this.nueva_intencion.id_usuario = this.user.getId();
    this.chatService.crearIntencionChat(this.nueva_intencion).then(() => {
      this.nueva_intencion = { activo: true };
      this.creando_intencion = false;
      if (this.categoria.idtbl_categoria_experticia == this.categoria_creando.idtbl_categoria_experticia) {

      }
    })
  }

}
