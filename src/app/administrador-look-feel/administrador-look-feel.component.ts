import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookFeelService } from '../providers/look-feel.service';
import { ColorEvent } from 'ngx-color';
import swal from 'sweetalert2';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';

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
  url_logo;
  url_favicon;
  logo_name: string = '';
  favicon_name: string = '';
  loading: boolean = false;
  is_change_color: boolean = false;
  is_change: boolean = false;
  user: User;

  constructor(private look_service: LookFeelService, private router: Router, private user_service: UserService) {
    this.colors = ['#ffffff', '#fdcecd', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb', '#272727', '#444141', '#616161','#383838'];
    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.init();
    }
    this.user_service.observableUsuario.subscribe(u => {
      this.user = u;
      if (this.user) {
        this.init();
      }
    })
  }

  ngOnInit() {
    
  }

  init() {
    this.getAllSettings();
    this.getHomeText();
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
        if(this.user.getModoNocturno() == 0 || this.user.getModoNocturno() == null) {
          setting.nombre === 'color_barra_superior' ? this.old_color_toolbar = setting.valor : '';
        } else {
          setting.nombre === 'color_barra_oscuro' ? this.old_color_toolbar = setting.valor : '';
        }
        
      });
    });

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
      if(this.user.getModoNocturno() == 0 || this.user.getModoNocturno() == null) {
        this.look_service.updateSetting(this.color_toolbar, 'color_barra_superior').then(result => {
          this.loading = true; 
          window.location.reload(); 
        });
      } else {
        this.look_service.updateSetting(this.color_toolbar, 'color_barra_oscuro').then(result => {
          this.loading = true; 
          window.location.reload(); 
        });
      }
      
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
    this.saveFavicon();
    this.saveLogo();
    this.saveColor();
    this.saveHomeText();
    this.saveSearchPlaceholder();
  }


}
