import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookFeelService } from '../providers/look-feel.service';
import { ColorEvent } from 'ngx-color';
import swal from 'sweetalert2';

@Component({
  selector: 'app-administrador-look-feel',
  templateUrl: './administrador-look-feel.component.html',
  styleUrls: ['./administrador-look-feel.component.scss']
})
export class AdministradorLookFeelComponent implements OnInit {

  favicon_file: File;
  logo_file: File;
  file_name: string = '';
  old_color_toolbar: string = '';
  color_toolbar: string = '';
  colors = [];
  home_text: string = '';
  home_text_id: string = '';
  search_placeholder: string = '';
  dark_mode: boolean;
  is_dark_mode: number;
  dark_mode_id: string;
  is_update_dark_mode: boolean = false;
  url_logo;
  url_favicon;
  logo_name: string = '';
  favicon_name: string = '';
  loading: boolean = false;
  is_change_color: boolean = false;
  is_change: boolean = false;

  constructor(private look_service: LookFeelService, private router: Router) {
    this.colors = ['#ffffff', '#fdcecd', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'];
    this.getAllSettings();
    this.getHomeText();
  }

  ngOnInit() {
    
  }
  
  /**
   * Funcion para obtener todos los valores de la configuracion de look&feel
   */
  getAllSettings() {
    this.look_service.getAllSettings().then((result) => {
      result.forEach(setting => {
        setting.nombre === 'url_favicon' ? this.url_favicon = setting.valor : '';
        setting.nombre === 'url_logo' ? this.url_logo = setting.valor : '';
        setting.nombre === 'placeholder_buscador' ? this.search_placeholder = setting.valor : '';
        setting.nombre === 'color_barra_superior' ? this.old_color_toolbar = setting.valor : '';
        setting.nombre === 'modo_nocturno' ? this.dark_mode_id = setting.idtbl_configuracion_look_feel + '' : '';
      });
    });

    this.getValueDarkMode();
  }

  /**
   * Funcion para obtener el valor de la configuracion del modo nocturno del usuario
   */
  getValueDarkMode() {
    this.look_service.getValueSettingUser('modo_nocturno').then((result) => {
      if(result.length == 0) {
        this.is_dark_mode = 0;
        this.is_update_dark_mode = false;
      } else {
        this.is_dark_mode = result[0].valor;
        this.is_update_dark_mode = true;
      }
    });
  }

  /**
   * Funcion para detectar si el usuario activa o desactiva el modo nocturno
   */
  onDarkModeChange(event) {
    this.dark_mode = event.target.checked;
    this.is_change = true;
  }

  /**
   * Funcion para detectar si un usuario adjunto una imagen para cambiar el logo
   */
  onLogoChange(event) {
    let file = event.target.files[0];
    if(file != undefined) {
      if (file.type.match(/image\/*/) == null) {
        this.showModal();
      } else {
        this.logo_file = file;
        this.logo_name = file.name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => this.url_logo = reader.result;
        this.is_change = true;
      }
    } else {
      this.logo_name = '';
    }
  }

  /**
   * Funcion para detectar si un usuario adjunto una imagen para cambiar el logo
   */
  onFaviconChange(event){ 
    let file = event.target.files[0];
    if(file != undefined) {
      if (file.type.match(/image\/*/) == null) {
        this.showModal();
      } else {
        this.favicon_file = file;
        this.favicon_name = file.name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => this.url_favicon = reader.result;
        this.is_change = true;
      }
    } else {
      this.favicon_name = '';
    }
  }

  /**
   * Funcion para mostrar la modal de error si un usuario adjunta un archivo diferente a una imagen
   */
  showModal () {
    swal.fire({
      title: 'Formato no permitido',
      text: "Solo se permiten imagenes",
      type: 'warning',
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Funcion para obtener el valor del color seleccionado por el usuario
   */
  handleChangeComplete(event: ColorEvent) {
    this.color_toolbar = event.color.hex;
    this.old_color_toolbar = event.color.hex;
    this.is_change = true;
  }

  /**
   * Funcion para detectar si el usuario escribio en un campo de texto
   */
  onKeyUp(event) {
    this.is_change = true;
  }

  /**
   * Funcion para obtener el valor del titulo del home
   */
  getHomeText() {
    this.look_service.getHomeText().then((result) => {
      this.home_text = result[0].valor;  
      this.home_text_id = result[0].idtbl_configuracion;
    });
  }

  /**
   * Funcion para guardar la configuracion de modo oscuro
   */
  saveDarkMode() {
    let change_dark_mode;
    if(this.dark_mode) {
      change_dark_mode = 1;
    } else {
      change_dark_mode = 0;
    }
        
    if(this.is_update_dark_mode) {
      this.look_service.updateSettingByUser(change_dark_mode, this.dark_mode_id).then(result => {
        this.loading = true; 
        window.location.reload(); 
      });
    } else {
      this.look_service.addSettingByUser(this.dark_mode_id, change_dark_mode).then(result => {
        this.loading = true; 
        window.location.reload(); 
      });
    }
  }

  /**
   * Funcion para guardar la configuracion del favicon
   */
  saveFavicon() {
    if(this.favicon_file != null) {
      const form_data = new FormData();
      form_data.append('favicon_file', this.favicon_file);
      this.look_service.changeFavicon(form_data).then((result) => {
        if(result.success){
          this.look_service.updateSetting(result.file.url, 'url_favicon').then(result => {
            this.loading = true; 
            window.location.reload(); 
          });
        }
      });
    }
  }

  /**
   * Funcion para guardar la configuracion del logo
   */
  saveLogo() {
    if(this.logo_file != null) {
      const form_data = new FormData();
      form_data.append('logo_file', this.logo_file);
      this.look_service.changeLogo(form_data).then((result) => {
        if(result.success){
          this.look_service.updateSetting(result.file.url, 'url_logo').then(result => {
            this.loading = true; 
            window.location.reload(); 
          });
        }
      });
    }
  }

  /**
   * Funcion para guardar la configuracion del color
   */
  saveColor() {
    if(this.color_toolbar != '') {
      this.look_service.updateSetting(this.color_toolbar, 'color_barra_superior').then(result => {
        this.loading = true; 
        window.location.reload(); 
      });
    }
  }

  /**
   * Funcion para guardar la configuracion del titulo del home
   */
  saveHomeText() {
    this.look_service.updateHomeText(this.home_text, this.home_text_id).then(result => {
      this.loading = true; 
      window.location.reload(); 
    });
  }

  /**
   * Funcion para guardar la configuracion del placeholder del buscador
   */
  saveSearchPlaceholder() {
    this.look_service.updateSetting(this.search_placeholder, 'placeholder_buscador').then(result => {
      this.loading = true; 
      window.location.reload(); 
    });
  }

  /**
   * Funcion para guardar las configuraciones de look&feel
   */
  saveSetting() {
    this.saveDarkMode();
    this.saveFavicon();
    this.saveLogo();
    this.saveColor();
    this.saveHomeText();
    this.saveSearchPlaceholder();
  }


}
