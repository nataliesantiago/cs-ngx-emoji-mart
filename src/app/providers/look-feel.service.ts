import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LookFeelService {

  user;
  constructor(private ajax: AjaxService, private userService: UserService) {
    this.user = this.userService.getUsuario();
    this.userService.observableUsuario.subscribe(u => {
        this.user = u;
    });
  }

  changeFavicon(favicon: any):Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.postData('administrar-look-feel/cambiar-favicon', favicon).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

  changeLogo(logo: any):Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.postData('administrar-look-feel/cambiar-logo', logo).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

  getAllSettings():Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.get('administrar-look-feel/obtener-look-feel', {}).subscribe(response => {
        if(response.success){
          resolve(response.settings);
        }else{
          reject();
        }
      });
    });
  }

  getSpecificSetting(field_name: string):Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.get('administrar-look-feel/obtener-una-configuracion', { field_name: field_name }).subscribe(response => {
        if(response.success){
          resolve(response.settings);
        }else{
          reject(response);
        }
      });
    });
  }

  updateSetting(value, field_name) {
    return new Promise((resolve, reject) => {
      this.ajax.post('administrar-look-feel/editar-configuracion', { value: value, user_id: this.user.getId(), field_name: field_name }).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

  getHomeText() {
    return new Promise((resolve, reject) => {
      this.ajax.get('administracion/obtener-texto-home', {}).subscribe(response => {
        if(response.success){
          resolve(response.item);
        }else{
          reject(response);
        }
      });
    });
  }

  updateHomeText(value, home_text_id) {
    return new Promise((resolve, reject) => {
      this.ajax.post('administracion/editar', { item: { valor: value, usuario_modificacion: this.user.getId(), idtbl_configuracion: home_text_id } }).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

}
