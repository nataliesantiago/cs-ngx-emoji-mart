import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  user;

  constructor(private ajax: AjaxService, private userService: UserService) {
    this.user = this.userService.getUsuario();
    if (this.user) {

    }
    this.userService.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {

      }
    })
  }

  enviarNotificacionUsuario(id_usuario: number, titulo: string, texto: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.post('notificacion/enviar/usuario', { id_usuario: id_usuario, titulo: titulo, texto: texto }).subscribe(d => {
        if (d.success) {
          resolve();
        } else {
          reject();
        }
      });

    })
  }


  obtenerNotificacionesAdministracion(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.get('notificacion/obtener', {}).subscribe(d => {
        if (d.success) {
          resolve(d.notificaciones);
        } else {
          reject();
        }
      });

    })
  }


  obtenerListaDependencias(): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.get('notificacion/obtener-dependencias', {}).subscribe(d => {
        if (d.success) {
          resolve(d.dependencias);
        } else {
          reject();
        }
      });

    })
  }


  guardarNotificacion(notificacion: {}, file: File, lista_asociada: any, id_usuario: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (file) {
        const fd = new FormData();
        fd.append('archivo', file);
        this.ajax.postData('notificacion/subir-imagen', fd).subscribe(d => {
          if (d.success) {
            
            this.ajax.post('notificacion/guardar', { notificacion: notificacion, url: d.archivo.url, lista_asociada: lista_asociada, id_usuario: id_usuario }).subscribe(d => {
              if (d.success) {
                resolve(d);
              }
            })
          }
        })
      } else {
        this.ajax.post('notificacion/guardar', { notificacion: notificacion, url: "", lista_asociada: lista_asociada, id_usuario: id_usuario }).subscribe(d => {
          if (d.success) {
            resolve(d);
          }
        })
      }

    })
  }

  guardarUsuariosNotificacion(ids_usuarios: any, id_notificacion: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.post('notificacion/guardar-usuarios-notificacion', { ids_usuarios: ids_usuarios, id_notificacion: id_notificacion }).subscribe(d => {
        if (d.success) {
          resolve(d);
        } else {
          reject();
        }
      });

    })
  }


  guardarDependencias(lista_asociada: any, id_notificacion: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.post('notificacion/guardar-dependencias-notificacion', { lista_dependencias: lista_asociada, id_notificacion: id_notificacion }).subscribe(d => {
        if (d.success) {
          resolve(d);
        } else {
          reject();
        }
      });

    })
  }


  cancelarNotificacion(notificacion: any): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.post('notificacion/desactivar-notificacion', { notificacion: notificacion }).subscribe(d => {
        if (d.success) {
          resolve(d);
        } else {
          reject();
        }
      });

    })
  }


  leerNotificaciones(id_usuario: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.get('notificacion/leer-notificaciones-usuario', { id_usuario: id_usuario }).subscribe(d => {
        if (d.success) {
          resolve(d.notificaciones);
        } else {
          reject();
        }
      });

    })
  }

  obtenerNotificacionesAntiguas(id_usuario: number): Promise<any> {
    return new Promise((resolve, reject) => {

      this.ajax.get('notificacion/obtener-notificaciones-usuario-antiguas', { id_usuario: id_usuario }).subscribe(d => {
        if (d.success) {
          resolve(d.notificaciones);
        } else {
          reject();
        }
      });

    })
  }

  obtenerCantidadCaracteresNotificacion(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.get('administracion/obtener-caracteres-notificacion', {}).subscribe(p => {
        if (p.success) {
          resolve(p.item[0].valor);
        }
      });
    })
  }

}
