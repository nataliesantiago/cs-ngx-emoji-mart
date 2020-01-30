import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import { User } from '../../schemas/user.schema';
import { MensajeAutomatico } from '../../schemas/interfaces';
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
  message: MensajeAutomatico = {idtbl_mensaje_automatico_chat:null,texto:'',timeout:null, id_tipo_mensaje:null,fecha_creacion:null,
                                fecha_ultima_modificacion:null,id_usuario_modificacion:null,timeout_tmp:null,texto_tmp:''};
  message_types;
  is_timeout = false;
  displayedColumns = ['acciones', 'texto', 'timeout', 'tipo', 'activo'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'mensaje', type: 'string' },
    { field: 'tipo', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  is_edit_timeout = false;
  is_correct = false;
  filters = {};
  messages;

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

  /**
   * inicializa la informacion necesaria
   */
  init() {
    this.getMessageType();
    this.getAllMessages();
  }

  /**
   * obtiene todos tipos de mensajes automaticos
   */
  getMessageType() {
    this.mensajeAutomatico.getMessageType().then((result) => {
      this.message_types = result;
    });
  }

  /**
   * obtiene todos los mensajes automaticos
   */
  getAllMessages() {
    this.mensajeAutomatico.getAllMessagesWithType().then((result) => {
      this.messages = result;
      result.forEach((message) => {
        message.texto_tmp = message.texto;
        message.timeout_tmp = message.timeout;
      });
      this.createTable(result);
    });
  }

  /**
   * crea la tabla correspondiente con sus datos
   * @param data 
   */
  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cg.detectChanges();
  }

  /**
   * verifica el tipo de mensaje que se va a crear para habilitar el campo de ingresar el tiempo
   * @param event 
   */
  onChangeType(event) {
    this.message.id_tipo_mensaje = event.value;
    if(event.value == 3 || event.value == 5) {
      this.is_timeout = true;
    } else {
      this.is_timeout = false;
    }
  }

  /**
   * al editar un campo verifica el tipo de mensaje que se va a crear para habilitar el campo de ingresar el tiempo
   * @param event 
   * @param row 
   */
  onChangeTypeTable(event, row) {
    row.id_tipo_mensaje = event.value;
    if(event.value == 3 || event.value == 5) {
      row.is_edit_timeout = true;
    } else {
      row.is_edit_timeout = false;
    }
  }

  /**
   * crea el mensaje automatico
   */
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
          this.clearFields();
        })
      }
    } 
  }

  /**
   * actualiza un mensaje automatico especifico
   * @param e 
   */
  updateMessage(e){
    e.update = false;
    e.texto = e.texto_tmp;
    e.timeout = e.timeout_tmp;
    e.id_usuario_modificacion = this.user.getId();
    this.mensajeAutomatico.updateMessage(e).then((result) => {
      this.getAllMessages();
    });
  }

  /**
   * desactiva un mensaje automatico
   * @param e 
   */
  inactiveMessage(e){
    swal.fire({
      title: 'Cuidado',
      text: "Al momento de activarlo, se desactivarán los otros mensajes del mismo tipo",
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

  /**
   * verifica el tipo de mensaje a activar
   * @param e 
   */
  activeMessage(e){
    if(e.id_tipo_mensaje != 3) {
      this.activeOtherType(e);
    } else {
      this.activeMessageTimeout(e);
    }
    
  }

  /**
   * activa un mensaje y desactiva los mensajes del mismo tipo que esten activos
   * @param e 
   */
  activeOtherType(e) {
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

  /**
   * activa los mensajes de tipo timeout
   * @param e 
   */
  activeMessageTimeout(e) {
    swal.fire({
      title: '',
      text: "Confirme para activar el mensaje",
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
        let message = {user_id: this.user.getId(), message_id: e.idtbl_mensaje_automatico_chat}
        this.mensajeAutomatico.activeMessageTimeout(message).then((result) => {
          this.getAllMessages();
        });
      }
    })
  }

  /**
   * valida que las variables ingresadas correspondan con las permitidas
   */
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

  /**
   * muestar la modal de error en las variables
   */
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

  /**
   * aplica los filtros generales a la tabla
   * @param filterValue 
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * aplica filtros especificos a la tabla
   * @param name 
   * @param event 
   */
  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.messages);
    } else {
      this.filters[name] = event.value;
      let newArray = this.messages;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

  /**
   * limpia los campos del formulario de creacion
   */
  clearFields() {
    this.message.texto = '';
    this.message.timeout = null;
  }

}
