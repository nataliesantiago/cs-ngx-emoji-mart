import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

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
  dataSource = new MatTableDataSource([]);
  user;
  user_id;
  data = [];

  constructor(private ajax: AjaxService, private user_service: UserService, private router: Router, private cg: ChangeDetectorRef) { 

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
    this.ajax.get('motivos-cierre-chat/obtener', {}).subscribe(response => {
      if(response.success){
        this.data = response.reasons;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.cg.detectChanges();
      }
    });
  }

  /**
   * Funcion para redirigir al formulario de edicion de un motivo especifico
   */
  editReason(e){
    this.router.navigate(['/formulario-motivo-cierre-chat', e.idtbl_motivo_cierre_chat]);
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
        this.ajax.post('motivos-cierre-chat/eliminar', { reason_id: e.idtbl_motivo_cierre_chat, user_id: this.user_id }).subscribe(p => {
          if(p.success){
            this.getReasons();
          }
        })
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
