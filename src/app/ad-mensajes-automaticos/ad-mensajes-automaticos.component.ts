import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import { User } from '../../schemas/user.schema';
import { MensajeAutomatico, ShortCut, GuionChat } from '../../schemas/interfaces';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { MensajeAutomaticoService } from '../providers/mensajes-automaticos.service';
import { UserService } from '../providers/user.service';

@Component({
  selector: 'app-ad-mensajes-automaticos',
  templateUrl: './ad-mensajes-automaticos.component.html',
  styleUrls: ['./ad-mensajes-automaticos.component.scss']
})
export class AdMensajesAutomaticosComponent implements OnInit {

  user: User;
  create_message = false;
  message: MensajeAutomatico = {texto: '', timeout: null, id_tipo_mensaje: null, fecha_creacion: null, 
  fecha_ultima_modificacion: null, id_usuario_modificacion: null};
  message_types;
  is_timeout = false;
  displayedColumns = ['acciones', 'mensaje', 'tiempo', 'tipo', 'activo'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'mensaje', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  is_edit_timeout = false;
  is_correct = false;

  constructor(private userService: UserService, private mensajeAutomatico: MensajeAutomaticoService, private cg: ChangeDetectorRef) {
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

  init() {
    this.getMessageType();
    this.getAllMessages();
  }

  getMessageType() {
    this.mensajeAutomatico.getMessageType().then((result) => {
      this.message_types = result;
    });
  }

  getAllMessages() {
    this.mensajeAutomatico.getAllMessagesWithType().then((result) => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cg.detectChanges();
      this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    });
  }

  onChangeType(event) {
    this.message.id_tipo_mensaje = event.value;
    if(event.value == 3) {
      this.is_timeout = true;
    } else {
      this.is_timeout = false;
    }
  }

  onChangeTypeTable(event, row) {
    row.id_tipo_mensaje = event.value;
    if(event.value == 3) {
      row.is_edit_timeout = true;
    } else {
      row.is_edit_timeout = false;
    }
  }

  createMessage() {
    
    if(this.message.texto == '' || this.message.id_tipo_mensaje == null) {
      swal.fire({
        title: 'Complete todos los campos',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      });
    } else {
      this.validarVariablesPermitidas(this.message.texto);
      if(!this.is_correct) {
        this.modalErrorVariables();
      } else {
        this.message.id_usuario_modificacion = this.user.getId();
        this.mensajeAutomatico.createMessage(this.message).then(id => {
          this.init();
          this.create_message = false;
        })
      }
    } 
  }

  updateMessage(e){
    e.update = false;
    e.id_usuario_modificacion = this.user.getId();
    this.mensajeAutomatico.updateMessage(e).then((result) => {
      this.getAllMessages();
    });
  }

  inactiveMessage(e){
    swal.fire({
      title: 'Cuidado',
      text: "Confirme para desactivar el mensaje automatico",
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
        this.mensajeAutomatico.inactiveMessage(e.idtbl_mensaje_automatico_chat).then((result) => {
          this.getAllMessages();
        });
      }
    });
  }

  activeMessage(e){
    swal.fire({
      title: 'Confirme para activar el mensaje',
      text: "Al momento de activaralo, se desactivará el mensaje de este tipo que este activo",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Activar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        let message = {user_id: this.user.getId(), message_id: e.idtbl_mensaje_automatico_chat, message_type_id: e.id_tipo_mensaje}
        this.mensajeAutomatico.activeMessage(message).then((result) => {
          this.getAllMessages();
        });
      }
    })
  }

  validarVariablesPermitidas(texto) {
    let variables_permitidas = ['{nombre}', '{correo}', '{categoria}', '{fecha_actual}', '{busqueda}', '{id_conversacion}'];
    let variables = texto.match(/{.*?}/g);
    this.is_correct = true;
    if(variables != null) {
      variables.forEach(variable => {
        if(!(variables_permitidas.indexOf(variable) > -1)) {
          this.is_correct = false;
        } 
      });
    }
  }

  modalErrorVariables() {
    swal.fire({
      title: 'Advertencia',
      text: "Alguna de las variables ingresadas no es correcta, por favor verifiquelas",
      type: 'warning',
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'custom-sweet'
      }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
