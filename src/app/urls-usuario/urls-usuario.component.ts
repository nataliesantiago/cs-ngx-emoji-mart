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
  displayedColumns = ['id', 'nombre', 'valor', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  id_usuario;
  usuario;
  editar = true;
  nuevo = { label: '', url: '', id_usuario_creador: '' };

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService) {
    this.usuario = user.getUsuario();
    // console.log(this.usuario);
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo }).subscribe(d => {
      if (d.success) {
        // console.log("funciona");
        // console.log(d.usuario[0].idtbl_usuario);
        this.id_usuario = d.usuario[0].idtbl_usuario;
        this.ajax.get('administracion/obtener-url', { id_usuario: this.id_usuario }).subscribe(p => {
          if (p.success) {
            // console.log("funciona");
            // console.log(p.items);
            this.items_administracion = p.items;
            // console.log(this.items_administracion);
            this.dataSource = new MatTableDataSource(this.items_administracion);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.cg.detectChanges();
          }
        })
      }
    });
  }

  ngOnInit() {
  }

  async nuevoRegistro() {
    const { value: formValues } = await Swal.fire({
      title: 'Complete los campos',
      html:
        '<input id="swal-input1" placeholder="Digite el nombre" class="swal2-input">' +
        '<input type="url" id="swal-input2" placeholder="Digite la url" class="swal2-input">',
      focusConfirm: false,
    })
    if (formValues) {
      let a: any = document.getElementById('swal-input1');
      let b: any = document.getElementById('swal-input2');
      this.nuevo.label = a.value;
      this.nuevo.url = b.value;
      this.nuevo.id_usuario_creador = this.id_usuario;
      if (this.nuevo.label != "" || this.nuevo.url != "") {
        this.ajax.post('administracion/guardar-url', { item: this.nuevo }).subscribe(d => {
          if (d.success) {
            Swal.fire(
              'Se guardó el registro correctamente.',
            )
            this.ajax.get('administracion/obtener-url', { id_usuario: this.id_usuario }).subscribe(p => {
              if (p.success) {
                // console.log("funciona");
                // console.log(p.items);
                this.items_administracion = p.items;
                // console.log(this.items_administracion);
                this.dataSource = new MatTableDataSource(this.items_administracion);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.cg.detectChanges();
              }
            })
          }
        })
      }

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
    Swal.fire({
      title: 'Guardar cambios',
      text: "Confirme para guardar los cambios",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.value) {
        this.ajax.post('administracion/editar-url', { item: u }).subscribe(d => {
          if (d.success) {
            // console.log("guardó editar");
            u.editando = false;
            Swal.fire(
              'Se guardó el registro correctamente.',
            )
          }
        })

      }
    })
  }

  eliminarRegistro(u) {
    Swal.fire({
      title: 'Eliminar URL',
      text: "Confirme para eliminar el registro",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar'
    }).then((result) => {
      if (result.value) {
        this.ajax.post('administracion/eliminar-url', { item: u }).subscribe(d => {
          if (d.success) {
            // console.log("guardó editar");
            u.editando = false;
            Swal.fire(
              'Se eliminó el registro correctamente.',
            )
            this.ajax.get('administracion/obtener-url', { id_usuario: this.id_usuario }).subscribe(p => {
              if (p.success) {
                // console.log("funciona");
                // console.log(p.items);
                this.items_administracion = p.items;
                // console.log(this.items_administracion);
                this.dataSource = new MatTableDataSource(this.items_administracion);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.cg.detectChanges();
              }
            })
          }
        })

      }
    })
  }

}
