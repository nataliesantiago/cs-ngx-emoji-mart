import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { UserService } from '../providers/user.service';
import { MotivoCierreChatService } from '../providers/motivo-cierre-chat.service';
import { MotivoCierreChat, CategoriaExperticia } from '../../schemas/interfaces';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { FormControl } from '@angular/forms';
import { ChatService } from '../providers/chat.service';
import { startWith, map } from 'rxjs/operators';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-ad-motivo-cierre-chat',
  templateUrl: './ad-motivo-cierre-chat.component.html',
  styleUrls: ['./ad-motivo-cierre-chat.component.scss']
})
export class AdMotivoCierreChatComponent implements OnInit {

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['actions', 'idtbl_motivo_cierre_chat', 'nombre', 'categoria'];
  reason: MotivoCierreChat = { idtbl_motivo_cierre_chat: null, name: '', create_user_id: null, create_date: null, 
          update_last_user_id: null, update_date: null, active: true, category_id: null };
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'id', type:'number'},
    {field: 'name', type:'string'},
    {field: 'category', type:'string'}
  ];
  user;
  user_id;
  data = [];
  is_created = false;
  reason_control = new FormControl();
  edit_reason_control = new FormControl();
  filtered_options;
  edit_filtered_options;
  categories: Array<CategoriaExperticia>;

  constructor(private user_service: UserService, private motivo_service: MotivoCierreChatService, private router: Router, 
            private cg: ChangeDetectorRef, private chat_service: ChatService, private utils_service: UtilsService) { 

    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.user_id = this.user.idtbl_usuario;
      this.init();
    }
    this.user_service.observableUsuario.subscribe(u => {
      this.user = u;
      this.user_id = u.idtbl_usuario;
      if (this.user) {
        this.init();
      }
    })

    this.getReasons();
    
  }

  ngOnInit() {
    
  }

  /**
   * inicializa la informacion necesaria
   */
  init() {
    this.chat_service.getCategoriasExperticia().then((c: Array<CategoriaExperticia>) => {
      this.categories = c;
      this.filtered_options = this.reason_control.valueChanges.pipe(
        startWith(''),
        map(value => this.utils_service.filter(this.categories, value, 'nombre'))
      );
      this.edit_filtered_options = this.edit_reason_control.valueChanges.pipe(
        startWith(''),
        map(value => this.utils_service.filter(this.categories, value, 'nombre'))
      );
    });
  }

  /**
   * selecciona la categoria del motivo a crear
   * @param value 
   */
  seleccionarCategoriaNueva(value) {
    this.reason.category_id = value.idtbl_categoria_experticia;
    this.reason_control.setValue(value.nombre);
  }

  /**
   * selecciona la categoria del motivo a editar
   * @param value 
   * @param row 
   */
  selectEditCategory(value, row) {
    row.id_categoria_experticia = value.idtbl_categoria_experticia;
    this.edit_reason_control.setValue(value.nombre);
  }

  /**
   * Funcion para obtener todos los motivos de cierre
   */
  getReasons() {
    this.motivo_service.getAllReasons().then((result) => {
      this.data = result;
      result.forEach((reason) => {
        reason.texto_tmp = reason.nombre;
      });
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cg.detectChanges();
      this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
        const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
          return (currentTerm + (data as { [key: string]: any })[key]);
        }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return dataStr.indexOf(transformedFilter) != -1;
      }
    });
  }

  /**
   * Funcion para guardar la informacion del motivo de cierre
   */
  saveOneReason() {
    if(this.reason.name == "" || this.reason_control.value == null || this.reason_control.value == ""){
      swal.fire({
        title: '',
        text: 'Por favor complete todos los campos',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      });
    } else if(this.reason.name.length > 450) {
      swal.fire({
        title: 'El limite de caracteres permitidos es 450',
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
      this.motivo_service.saveReason(this.reason, this.user_id).then((result) => {
        this.getReasons();
        this.is_created = false;
        this.reason_control.setValue('');
        this.reason.name = '';
      });
    }
  }

  /**
   * permite habilitar la edicion de un motivo
   * @param e 
   */
  editReason(e) {
    e.update=true;
    this.edit_reason_control.setValue(e.categoria);
  }

  /**
   * Funcion para editar un motivo especifico
   */
  updateReason(e){
    e.update = false;
    if(e.texto_tmp == "" || this.edit_reason_control.value == null || this.edit_reason_control.value == ""){
      swal.fire({
        title: '',
        text: 'Por favor complete todos los campos',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      });
    } else if(e.texto_tmp.length > 450) {
      swal.fire({
        title: 'El limite de caracteres permitidos es 450',
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
      this.motivo_service.updateReason(e.idtbl_motivo_cierre_chat, e.texto_tmp, e.id_categoria_experticia, this.user_id).then((result) => {
        this.getReasons();
      });
    }
  }

  /**
   * cancela la edicion de un motivo
   * @param e 
   */
  cancelUpdate(e) {
    e.update=false
    e.texto_tmp = e.nombre;
  }

  /**
   * Funcion para inactivar un motivo especifico
   */
  deleteReason(e){

    swal.fire({
      title: 'Eliminar Motivo',
      text: "Confirme para elminiar el motivo de cierre del chat",
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
        this.motivo_service.deleteReason(e.idtbl_motivo_cierre_chat, this.user_id).then((result) => {
          this.getReasons();
        });
      }
    })
    
  }

  /**
   * Funcion para filtrar los resultados de la tabla
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}
