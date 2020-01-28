import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChatService } from '../providers/chat.service';
import { UserService } from '../providers/user.service';
import { User } from '../../schemas/user.schema';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ExtensionArchivoChat, GuionChat } from '../../schemas/interfaces';
import { FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
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
  matTableFilter:matTableFilter;
  filterColumns = [
    {field: 'texto', type:'string'},
    {field: 'activo', type:'boolean', values:{"true":"Si","false":"No"}}];
  guiones = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  nuevo_guion: GuionChat = { activo: true };
  correcto = false;
  filters = {};
  
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

  /**
   * inicializa la informacion necesaria
   * @param recarga 
   */
  init(recarga?: boolean) {
    this.chatService.getGuiones().then(guiones => {
      this.guiones = guiones;
      this.guiones.forEach((e: GuionChat) => {
        e.texto_tmp = e.texto;
      })
      this.createTable(this.guiones);
    });
  }

  /**
   * crea la tabla con la informacion necesaria
   * @param data 
   */
  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
  }

  ngAfterViewInit() {
    
  }

  /**
   * aplica filtros generales a la tabla
   * @param filterValue 
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /**
   * verifica que las variables ingresadas sean correctas
   * @param texto 
   */
  validarVariablesPermitidas(texto) {
    let variables_permitidas = ['{nombre_cliente}', '{correo_cliente}', '{categoria}', '{fecha_actual}', '{busqueda}', '{id_conversacion}'];
    let variables = texto.match(/{.*?}/g);
    this.correcto = true;
    if (variables != null || variables != undefined) {
      variables.forEach(variable => {
        if(!(variables_permitidas.indexOf(variable) > -1)) {
          this.correcto = false;
        } 
      });
    }
  }

  /**
   * muestra la modal de error cuando una variable ingresada no es correcta
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
   * crea un nuevo guion
   */
  crearGuion() {
    this.validarVariablesPermitidas(this.nuevo_guion.texto);
    
    if(!this.correcto) {
      this.modalErrorVariables();
    } else {
      this.chatService.crearGuionChat(this.nuevo_guion.texto).then(d => {
        this.nuevo_guion = { activo: true };
        this.creando_extension = false;
        this.init(true);
      });
    }
    
  }

  /**
   * edita un guion especifico
   * @param e 
   */
  editarGuion(e) {
    e.editando = false;
    e.texto = e.texto_tmp;
    this.validarVariablesPermitidas(e.texto);
    
    if(!this.correcto) {
      this.modalErrorVariables();
    } else {
      this.chatService.actualizarGuionChat(e.texto, e.idtbl_guion_chat).then(() => {

      });
    }
    
  }

  /**
   * desactiva un guion especifico
   * @param e 
   */
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
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-sweet'
      }
    }).then((result) => {
      if (result.value) {
        this.chatService.desactivarGuionChat(e.idtbl_guion_chat).then((r) => {
          this.init();
        });
      }
    });
  }

  /**
   * aplica filtros especificos a la tabla
   * @param name 
   * @param event 
   */
  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.guiones);
    } else {
      this.filters[name] = event.value;
      let newArray = this.guiones;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}



