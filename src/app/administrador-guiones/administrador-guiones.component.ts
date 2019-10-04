import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ExtensionArchivoChat, GuionChat } from '../../schemas/interfaces';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'app-administrador-guiones',
  templateUrl: './administrador-guiones.component.html',
  styleUrls: ['./administrador-guiones.component.scss']
})
export class AdministradorGuionesComponent implements OnInit, AfterViewInit {

  user: User;
  creando_extension = false;
  displayedColumns = ['acciones', 'guion', 'activo'];
  dataSource: MatTableDataSource<any>;
  guiones = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nuevo_guion: GuionChat = { activo: true };
  
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
    this.chatService.getGuiones().then(guiones => {
      this.guiones = guiones;
      this.guiones.forEach((e: GuionChat) => {
        e.texto_tmp = e.texto;
      })
      this.dataSource = new MatTableDataSource(this.guiones);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  ngAfterViewInit() {
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  crearGuion() {
    this.chatService.crearGuionChat(this.nuevo_guion.texto).then(d => {
      this.nuevo_guion = { activo: true };
      this.creando_extension = false;
      this.init(true);
    });
  }

  editarGuion(e) {
    e.editando = false;
    e.texto = e.texto_tmp;
    this.chatService.actualizarGuionChat(e.texto, e.idtbl_guion_chat).then(() => {

    });
  }

  eliminarExtension(e) {
    swal.fire({
      title: 'Cuidado',
      text: "Desea Borrar el guión",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.chatService.desactivarGuionChat(e.idtbl_guion_chat).then((r) => {
          this.init();
        });
      }
    });
  }
}



