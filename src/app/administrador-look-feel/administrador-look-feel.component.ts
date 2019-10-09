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
  file_name = '';
  old_color_toolbar = '';
  color_toolbar = '';
  colors = [];
  home_text = '';
  home_text_id = '';
  search_placeholder = '';
  dark_mode: boolean;
  is_dark_mode;
  url_logo;
  url_favicon;
  logo_name = '';
  favicon_name = '';
  loading = false;
  is_change_color = false;
  is_change = false;

  constructor(private look_service: LookFeelService, private router: Router) {
    this.colors = ['#ffffff', '#fdcecd', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'];
    this.getAllSettings();
  }

  getAllSettings() {
    this.look_service.getAllSettings().then((result) => {
      result.forEach(setting => {
        setting.nombre === 'url_favicon' ? this.url_favicon = setting.valor : '';
        setting.nombre === 'url_logo' ? this.url_logo = setting.valor : '';
        setting.nombre === 'placeholder_buscador' ? this.search_placeholder = setting.valor : '';
        setting.nombre === 'color_barra_superior' ? this.old_color_toolbar = setting.valor : '';
        setting.nombre === 'modo_nocturno' ? this.is_dark_mode = setting.valor : '';
      });
    });
  }

  ngOnInit() {
    
  }

  darkMode(event) {
    this.dark_mode = event.target.checked;
    this.is_change = true;
  }

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

  handleChangeComplete(event: ColorEvent) {
    this.color_toolbar = event.color.hex;
    this.old_color_toolbar = event.color.hex;
    this.is_change = true;
  }

  onKeyUp(event) {
    this.is_change = true;
  }

  getHomeText() {
    this.look_service.getHomeText().then((result) => {
      this.home_text = result[0].valor;  
      this.home_text_id = result[0].idtbl_configuracion;
    });
  }

  saveConfig() {

    let change_dark_mode;
    if(this.dark_mode) {
      change_dark_mode = 1;
    } else {
      change_dark_mode = 0;
    }
    
    this.look_service.updateSetting(change_dark_mode, 'modo_nocturno').then(result => {
      this.loading = true; 
      window.location.reload(); 
    });

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
    
    if(this.color_toolbar != '') {
      this.look_service.updateSetting(this.color_toolbar, 'color_barra_superior').then(result => {
        this.loading = true; 
        window.location.reload(); 
      });
    }

    this.look_service.updateHomeText(this.home_text, this.home_text_id).then(result => {
      this.loading = true; 
      window.location.reload(); 
    });

    this.look_service.updateSetting(this.search_placeholder, 'placeholder_buscador').then(result => {
      this.loading = true; 
      window.location.reload(); 
    });
  }


}
