import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';

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

  enviarNotificacionUsuario(id_usuario: number, titulo: string, texto: string):Promise<any>{
    return new Promise((resolve, reject) => {

      this.ajax.post('notificacion/enviar/usuario', {id_usuario: id_usuario, titulo: titulo, texto: texto}).subscribe(d => {
        if(d.success){
          resolve();
        }else{
          reject();
        }
      });
      
    })
  }


  obtenerNotificacionesAdministracion():Promise<any>{
    return new Promise((resolve, reject) => {

      this.ajax.get('notificacion/obtener', {}).subscribe(d => {
        if(d.success){
          resolve(d.notificaciones);
        }else{
          reject();
        }
      });
      
    })
  }

}
