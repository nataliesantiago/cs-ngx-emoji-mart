import { Component, OnInit, ChangeDetectorRef, ViewChild, Input, EventEmitter, Output  } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-formulario-usuarios',
  templateUrl: './formulario-usuarios.component.html',
  styleUrls: ['./formulario-usuarios.component.scss']
})
export class FormularioUsuariosComponent implements OnInit {

  usuario;
  id_usuario;
  nombre_experto;
  correo_experto;
  perfiles;
  roles;
  datos_experto = { perfil: 0, rol: 0, peso: 0};
  @Input() public usuario_editar: number;
  @Output() public onfinish = new EventEmitter<boolean>();

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, 
              private qs: QuillService, private http: HttpClient, private utilsService: UtilsService){
    
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
        this.init();
      }
    })

    this.user.getPerfilesUsuario().then( p => {
      this.perfiles = p;
    })

    this.user.getRolesUsuario().then( p => {
      this.roles = p;
    })

  }

  init(){
    
  }

  enviarDato(){    
    this.user.editarUsuario(this.datos_experto, this.usuario_editar).then( d => {
      this.onfinish.emit(true);
    });    
  }

  cancelarRegistro(){
    this.onfinish.emit(true);
  }

  ngOnInit() {
    
    this.user.getInfoUsuario(this.usuario_editar).then( d => {
      this.correo_experto = d.correo;
      this.nombre_experto = d.nombre;
      this.datos_experto.perfil = d.id_perfil;
      this.datos_experto.rol = d.id_rol;
      this.datos_experto.peso = d.peso_chat;
      
      this.cg.detectChanges();
    });
  }

}
