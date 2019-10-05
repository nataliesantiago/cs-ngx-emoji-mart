import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { MotivoCierreChatService } from '../providers/motivo-cierre-chat.service';
import { MotivoCierreChat } from '../../schemas/interfaces';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';

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
  displayedColumns = ['actions', 'id', 'name',];
  reason: MotivoCierreChat = { idtbl_motivo_cierre_chat: null, name: '', create_user_id: null, create_date: null, update_last_user_id: null, update_date: null, active: true };
  dataSource = new MatTableDataSource([]);
  matTableFilter:matTableFilter;
  filterColumns = [
    {field:'fecha_busqueda', type:'string'},
    {field: 'texto_busqueda', type:'string'},
    {field: 'id_tipo_busqueda', type:'string'},
    {field: 'url', type:'string'}
  ];
  user;
  user_id;
  data = [];
  is_created = false;

  constructor(private ajax: AjaxService, private user_service: UserService, private motivo_service: MotivoCierreChatService, private router: Router, private cg: ChangeDetectorRef) { 

    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.user_id = this.user.idtbl_usuario;
    }
    this.user_service.observableUsuario.subscribe(u => {
      this.user = u;
      this.user_id = u.idtbl_usuario;
      if (this.user) {
      }
    })

    this.getReasons();
    
  }

  ngOnInit() {
    
  }

  /**
   * Funcion para obtener todos los motivos de cierre
   */
  getReasons() {
    this.motivo_service.getAllReasons().then((result) => {
      this.data = result;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cg.detectChanges();
      this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    });
  }

  /**
   * Funcion para guardar la informacion del motivo de cierre
   */
  saveOneReason() {
    if(this.reason.name == ""){
      swal.fire({
        title: 'El motivo de cierre es obligatorio',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
      });
    } else if(this.reason.name.length > 450) {
      swal.fire({
        title: 'El limite de caracteres permitidos es 450',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept',
        confirmButtonText: 'Aceptar',
      });
    } else {
      this.motivo_service.saveReason(this.reason, this.user_id).then((result) => {
        this.getReasons();
        this.is_created = false;
      });
    }
  }

  /**
   * Funcion para editar un motivo especifico
   */
  updateReason(e){
    e.update = false;
    this.motivo_service.updateReason(e.idtbl_motivo_cierre_chat, e.nombre, this.user_id).then((result) => {
      this.getReasons();
    });
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
      cancelButtonText: 'Cancelar'
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
