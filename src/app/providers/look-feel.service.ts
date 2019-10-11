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
  
  /**
   * Funcion para reemplazar el favicon y obtener la url correspondiente
   */
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

  /**
   * Funcion para reemplazar el logo y obtener la url correspondiente
   */
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

  /**
   * Funcion para obtener todas las configuraciones 
   */
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

  /**
   * Funcion para obtener una configuracion dependiendo el nombre
   */
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

  /**
   * Funcion para actualizar una configuracion dependiendo el nombre
   */
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

  /**
   * Funcion para obtener el titutlo del home
   */
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

  /**
   * Funcion para actualizar el titulo del home
   */
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

  /**
   * Funcion para obtener todas las configuraciones dependiendo el usuario
   */
  getSettingByUser():Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.get('administrar-look-feel/obtener-toda-config-usuario', { user_id: this.user.getId() }).subscribe(response => {
        if(response.success){
          resolve(response.settings);
        }else{
          reject(response);
        }
      });
    });
  }

  /**
   * Funcion para agregar un nuevo valor de una configuracion dependiendo la configuracion y el usuario
   */
  addSettingByUser(setting_id, value) {
    return new Promise((resolve, reject) => {
      this.ajax.post('administrar-look-feel/agregar-configuracion-usuario', { setting_id: setting_id, user_id: this.user.getId(), value:value }).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

  /**
   * Funcion para actualizar una configuracion dependiendo la configuracion y el usuario
   */
  updateSettingByUser(value, setting_id) {
    return new Promise((resolve, reject) => {
      this.ajax.post('administrar-look-feel/editar-configuracion-usuario', { value: value, setting_id: setting_id, user_id: this.user.getId() }).subscribe(response => {
        if(response.success){
          resolve(response);
        }else{
          reject(response);
        }
      });
    });
  }

  /**
   * Funcion para obtener el valor de una configuracion dependiendo el nombre de la configuracion y el usuario
   */
  getValueSettingUser(field_name: string):Promise<any>{
    return new Promise((resolve, reject) => {
      this.ajax.get('administrar-look-feel/valor-configuracion-usuario', { field_name: field_name, user_id: this.user.getId() }).subscribe(response => {
        if(response.success){
          resolve(response.settings);
        }else{
          reject(response);
        }
      });
    });
  }

}
