import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { LookFeelService } from '../providers/look-feel.service';

@Component({
  selector: 'app-administrador-look-feel',
  templateUrl: './administrador-look-feel.component.html',
  styleUrls: ['./administrador-look-feel.component.scss']
})
export class AdministradorLookFeelComponent implements OnInit {

  favicon_file: File;
  logo_file: File;
  file_name = '';

  constructor(private look_service: LookFeelService, private router: Router, private cg: ChangeDetectorRef) { }

  ngOnInit() {
  }

  darkMode(event) {
    console.log(event.target.checked);
  }

  onLogoChange(event) {
    this.logo_file = event.target.files[0];
  }

  onFaviconChange(event){    
    this.favicon_file = event.target.files[0];
  }

  saveConfig() {
    if(this.favicon_file != null) {
      const form_data = new FormData();
      form_data.append('favicon_file', this.favicon_file);
      this.look_service.changeFavicon(form_data).then((result) => {
        if(result.success){
          this.look_service.updateSetting(result.file.url, 'url_favicon').then(result => {
            this.router.navigate(['/']);
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
            this.router.navigate(['/']);
          });
        }
      });
    }
  }

}
