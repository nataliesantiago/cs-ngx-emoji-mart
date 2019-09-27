import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ExtensionArchivoChat } from '../../schemas/interfaces';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'app-adminsitrador-extensiones-chat',
  templateUrl: './adminsitrador-extensiones-chat.component.html',
  styleUrls: ['./adminsitrador-extensiones-chat.component.scss']
})
export class AdminsitradorExtensionesChatComponent implements OnInit, AfterViewInit {
  user: User;
  creando_extension = false;
  displayedColumns = ['acciones', 'extension', 'size'];
  dataSource: MatTableDataSource<any>;
  extensiones = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  solo_numeros = '^[+]?([1-9]+(?:[\.][0-9]*)?|\.[0-9]+)$';
  nueva_extension: ExtensionArchivoChat = { extension: null, megabytes_maximos: null };
  constructor(private chatService: ChatService, private userService: UserService) {
    this.user = this.userService.getUsuario();

    if (this.user) {
      this.init();
    }
    this.userService.observableUsuario.subscribe(u => {
      if (u) {
        this.user = u;
        this.init();
      } else {
        delete this.user;
      }
    });
  }

  ngOnInit() {
  }
  init(recarga?: boolean) {
    this.chatService.getConfiguracionesChat(recarga).then(configs => {
      this.extensiones = configs.extensiones;
      this.extensiones.forEach((e: ExtensionArchivoChat) => {
        e.control_megabytes = new FormControl(null, Validators.pattern('^[1-9]+([0-9]*)$'));
        e.editando = false;
        e.megas_tmp = e.megabytes_maximos;
      })
      this.dataSource = new MatTableDataSource(this.extensiones);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  crearExtension() {
    this.nueva_extension.id_usuario_creador = this.user.getId();
    this.chatService.crearExtensionArchivo(this.nueva_extension).then(d => {
      this.nueva_extension = { extension: null, megabytes_maximos: null };
      this.creando_extension = false;
      this.init(true);
    })
  }

  editarExtension(e: ExtensionArchivoChat) {
    e.id_usuario_ultima_modificacion = this.user.getId();
    e.megabytes_maximos = e.megas_tmp;
    e.editando = false;
    let a = { ...e };
    delete a.control_megabytes;
    this.chatService.editarExtension(a).then(() => {

    });
  }

  eliminarExtension(e: ExtensionArchivoChat) {
    swal.fire({
      title: 'Cuidado',
      text: "Desea Borrar la extensión",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        e.id_usuario_ultima_modificacion = this.user.getId();
        e.megabytes_maximos = e.megas_tmp;
        e.editando = false;
        let a = { ...e };
        delete a.control_megabytes;
        delete a.activo;
        this.chatService.editarExtension(a).then(() => {
          this.init(true);
        });
      }
    });
  }
}
