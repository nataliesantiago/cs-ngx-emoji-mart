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
import { NotificacionService } from '../providers/notificacion.service';
import { UtilsService } from '../providers/utils.service';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;


@Component({
  selector: 'app-formulario-notificaciones',
  templateUrl: './formulario-notificaciones.component.html',
  styleUrls: ['./formulario-notificaciones.component.scss']
})
export class FormularioNotificacionesComponent implements OnInit {

  usuario;
  id_usuario;
  notificacion = { titulo: '', texto: '', fecha_inicio: '', fecha_fin: '', url_adjunto: '', tipo_envio: '', hora_envio: '', hora_fin: '' };
  lista_envio = [];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  lista_objetos = [];
  displayedColumns = ['objeto', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  lista_asociada = [];
  archivo_adjunto;
  file: File;
  tipo_seleccion;
  nombre_archivo = '';
  limite_caracteres;
  fecha_actual;
  id_notificacion_editar;
  editar = false;

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef,
    private qs: QuillService, private http: HttpClient, private notificacionService: NotificacionService, private utilsService: UtilsService) {
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

    this.fecha_actual = moment().toDate();

    this.notificacionService.obtenerCantidadCaracteresNotificacion().then(n => {
      this.limite_caracteres = n;
    });
  }


  init() {

    this.route.params
      .filter(params => params.id_notificacion)
      .subscribe(params => {


        this.id_notificacion_editar = params.id_notificacion;

      });

    if (this.id_notificacion_editar != 'nuevo') {
      this.editar = true;
      this.notificacionService.notificacionEditar(this.id_notificacion_editar).then(r => {
        this.notificacion = r[0];
        let tipo_envio = this.notificacion[0].tipo_notificacion;
        this.notificacion = this.notificacion[0];
        this.lista_asociada = r[1];
        this.notificacion.tipo_envio = tipo_envio;
        this.notificacion.hora_envio = moment(this.notificacion.fecha_inicio).add(5, 'hours').format('HH:mm');
        this.notificacion.hora_fin = moment(this.notificacion.fecha_fin).add(5, 'hours').format('HH:mm');
        if (this.notificacion.tipo_envio == "2") {
          this.displayedColumns = ['objeto', 'acciones'];
          this.tipo_seleccion = "Personas";
          this.user.obtenerListaEmpleados().then(n => {

            this.lista_objetos = n;
            this.options = this.lista_objetos;
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => this.utilsService.filter(this.lista_objetos, value, 'nombre'))
            );
            this.dataSource = new MatTableDataSource(this.lista_asociada);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.cg.detectChanges();
          });
        } else if (this.notificacion.tipo_envio == "3") {
          this.displayedColumns = ['objeto', 'codigo', 'acciones'];
          this.tipo_seleccion = "Dependencias";
          this.notificacionService.obtenerListaDependencias().then(n => {

            this.lista_objetos = n;
            this.options = this.lista_objetos;
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => this.utilsService.filter(this.lista_objetos, value, 'nombre'))
            );
            this.dataSource = new MatTableDataSource(this.lista_asociada);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.cg.detectChanges();
          });
        }
      });
    }

  }

  listarObjetos() {

    if (this.notificacion.tipo_envio == "2") {
      this.displayedColumns = ['objeto', 'acciones'];
      this.tipo_seleccion = "Personas";
      this.lista_asociada = [];
      this.user.obtenerListaEmpleados().then(n => {

        this.lista_objetos = n;
        this.options = this.lista_objetos;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.lista_objetos, value, 'nombre'))
        );
      });
    } else if (this.notificacion.tipo_envio == "3") {
      this.displayedColumns = ['objeto', 'codigo', 'acciones'];
      this.tipo_seleccion = "Dependencias";
      this.lista_asociada = [];
      this.notificacionService.obtenerListaDependencias().then(n => {

        this.lista_objetos = n;
        this.options = this.lista_objetos;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.lista_objetos, value, 'nombre'))
        );
      });
    } else {
      this.lista_asociada = [];
      this.cg.detectChanges();
    }
  }

  private _filter(value: any): string[] {

    if (value.nombre) {
      const filterValue = value.nombre.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    } else {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }

  }

  seleccionarObjeto(e) {
    this.lista_asociada.push(e);
    this.dataSource = new MatTableDataSource(this.lista_asociada);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.myControl = new FormControl();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
  }

  borrarElemento(e) {

    swal.fire({
      title: 'Eliminar Persona o Grupo',
      text: "Confirme para eliminar la persona o grupo",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        let pos = 0;
        for (let i = 0; i < this.lista_asociada.length; i++) {
          if (e.idtbl_usuario) {
            if (this.lista_asociada[i].idtbl_usuario == e.idtbl_usuario) {
              pos = i;
            }
          }
          if (e.idtbl_dependencia) {
            if (this.lista_asociada[i].idtbl_dependencia == e.idtbl_dependencia) {
              pos = i;
            }
          }
        }
        this.lista_asociada.splice(pos, 1);
        this.dataSource = new MatTableDataSource(this.lista_asociada);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    })
  }

  enviarNotificacion() {

    if (this.notificacion.titulo == "" || this.notificacion.fecha_inicio == "" || this.notificacion.fecha_fin == "" || this.notificacion.hora_envio == "") {

      swal.fire({
        title: 'Digite los campos obligatorios',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })

    } else {

      if (this.lista_asociada.length == 0 && this.notificacion.tipo_envio != "1") {
        swal.fire({
          title: 'Seleccione almenos un destinatario',
          text: '',
          type: 'warning',
          buttonsStyling: false,
          confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
          confirmButtonText: 'Aceptar',
          customClass: {
            container: 'custom-sweet'
          }
        })
      } else {
        if (this.editar) {
          this.notificacionService.guardarNotificacionEditada(this.notificacion, this.file, this.lista_asociada, this.id_usuario).then(u => {
            let id_notificacion = this.id_notificacion_editar;
            let ids_usuarios = [];
            for (let i = 1; i < u.usuarios.length; i++) {
              let arreglo_actual = u.usuarios[i];
              for (let j = 0; j < arreglo_actual.length; j++) {
                if (!ids_usuarios.includes(arreglo_actual[j].idtbl_usuario)) {
                  ids_usuarios.push(arreglo_actual[j].idtbl_usuario);
                }
              }
            }
            if (this.notificacion.tipo_envio == '2') {
              this.notificacionService.guardarUsuariosNotificacion(ids_usuarios, id_notificacion).then(u => {
                if (u.success) {
                  this.router.navigate(['/administrador-notificaciones']);
                }
              });
            } else if (this.notificacion.tipo_envio == '3') {

              this.notificacionService.guardarDependencias(this.lista_asociada, id_notificacion).then(u => {
                if (u.success) {
                  this.router.navigate(['/administrador-notificaciones']);
                }
              });
            } else {
              this.router.navigate(['/administrador-notificaciones']);
            }
          });
        } else {
          this.notificacionService.guardarNotificacion(this.notificacion, this.file, this.lista_asociada, this.id_usuario).then(u => {
            let id_notificacion = u.usuarios[0];
            let ids_usuarios = [];
            
            for (let i = 1; i < u.usuarios.length; i++) {
              let arreglo_actual = u.usuarios[i];
              for (let j = 0; j < arreglo_actual.length; j++) {
                if (!ids_usuarios.includes(arreglo_actual[j].idtbl_usuario)) {
                  ids_usuarios.push(arreglo_actual[j].idtbl_usuario);
                }
              }
            }
            if (this.notificacion.tipo_envio == '2') {
              this.notificacionService.guardarUsuariosNotificacion(ids_usuarios, id_notificacion).then(u => {
                if (u.success) {
                  this.router.navigate(['/administrador-notificaciones']);
                }
              });
            } else if (this.notificacion.tipo_envio == '3') {

              this.notificacionService.guardarDependencias(this.lista_asociada, id_notificacion).then(u => {
                if (u.success) {
                  this.router.navigate(['/administrador-notificaciones']);
                }
              });
            } else {
              this.router.navigate(['/administrador-notificaciones']);
            }
          });
        }
      }
    }
  }

  onFileChange($event) {
    let file = $event.target.files[0];
    if(file.type.match(/image\/*/) || file.type.match(/video\/*/)){
      this.file = $event.target.files[0];
      this.nombre_archivo = $event.target.files[0].name;
    } else {
      swal.fire({
        title: 'Formato no permitido',
        text: "Solo se permiten imagenes o videos",
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  ngOnInit() {
  }

}
