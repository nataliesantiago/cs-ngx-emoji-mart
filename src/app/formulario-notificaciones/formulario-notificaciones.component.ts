import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-formulario-notificaciones',
  templateUrl: './formulario-notificaciones.component.html',
  styleUrls: ['./formulario-notificaciones.component.scss']
})
export class FormularioNotificacionesComponent implements OnInit {

  usuario;
  id_usuario;
  notificacion= {titulo: '', texto: '', fecha_inicio: '', fecha_fin: '', url_adjunto: '', tipo_envio: ''};
  lista_envio = [];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService, private http: HttpClient){
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
  }

  init(){

  }

  listarObjetos(){
    console.log(this.notificacion);
  }

  private _filter(value: any): string[] {
    
    if(value.nombre){
      const filterValue = value.nombre.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }else{
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

  ngOnInit() {
  }

}
