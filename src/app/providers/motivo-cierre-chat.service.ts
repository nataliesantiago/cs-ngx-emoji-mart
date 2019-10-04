import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MotivoCierreChatService {

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

  getAllReasons():Promise<any>{
    return new Promise((resolve, reject) => {

      this.ajax.get('motivos-cierre-chat/obtener', {}).subscribe(response => {
        if(response.success){
          resolve(response.reasons);
        }else{
          reject();
        }
      });
      
    })
  }

  saveReason(reason: any, user_id: number):Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.post('motivos-cierre-chat/guardar', { reason: reason, user_id: user_id }).subscribe(d => {
        if(d.success){
          resolve();
        }else{
          reject();
        }
      });
      
    })
  }

  updateReason(reason_id, name, user_id) {
    return new Promise((resolve, reject) => {
      this.ajax.post('motivos-cierre-chat/editar', { reason: {reason_id: reason_id, name: name }, user_id: user_id }).subscribe(d => {
        if(d.success){
          resolve();
        }else{
          reject();
        }
      });
      
    })
  }

  deleteReason(reason_id: number, user_id: number):Promise<any> {
    return new Promise((resolve, reject) => {
      this.ajax.post('motivos-cierre-chat/eliminar', { reason_id: reason_id, user_id: user_id }).subscribe(d => {
        if(d.success){
          resolve();
        }else{
          reject();
        }
      });
      
    })
  }
  

}
