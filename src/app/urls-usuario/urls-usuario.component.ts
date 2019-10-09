import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-urls-usuario',
  templateUrl: './urls-usuario.component.html',
  styleUrls: ['./urls-usuario.component.scss']
})
export class UrlsUsuarioComponent implements OnInit {

  items_administracion = [];
  displayedColumns = ['acciones', 'id', 'nombre', 'valor'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  id_usuario;
  usuario;
  editar = true;
  nueva_url = { label: '', url: '', id_usuario_creador: '' };
  is_created = false;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
      }
    })

    this.getUrls();
    
  }

  getUrls() {
    this.ajax.get('administracion/obtener-url', { id_usuario: this.id_usuario }).subscribe(p => {
      if (p.success) {
        this.items_administracion = p.items;
        this.dataSource = new MatTableDataSource(this.items_administracion);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  ngOnInit() {
  }

  async nuevoRegistro() {
    if(this.nueva_url.label == '' || this.nueva_url.url == '') {
      Swal.fire({
        title: 'Complete los campos',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
      });
    } else {
      this.nueva_url.id_usuario_creador = this.id_usuario;
      this.ajax.post('administracion/guardar-url', { item: this.nueva_url }).subscribe(d => {
        if (d.success) {
          this.getUrls();
          this.is_created = false;
        }
      })
    }
  }

  editarRegistro(u) {
    u.editando = true;
    this.cg.detectChanges();
  }

  cancelarEdicion(u) {
    u.editando = false;
  }

  guardarRegistro(u) {
    u.usuario_modificacion = this.id_usuario;
    this.ajax.post('administracion/editar-url', { item: u }).subscribe(d => {
      if (d.success) {
        this.getUrls();
      }
    })
  }

  eliminarRegistro(u) {
    Swal.fire({
      title: 'Eliminar Url',
      text: "Confirme para elminiar la url",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.ajax.post('administracion/eliminar-url', { item: u }).subscribe(d => {
          if (d.success) {
            this.getUrls();
          }
        })
      }
    })
  }

}
