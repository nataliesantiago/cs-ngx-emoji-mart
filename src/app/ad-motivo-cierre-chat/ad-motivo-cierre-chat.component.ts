import { Component, OnInit, ViewChild , ChangeDetectorRef} from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState
} from '@angular/cdk/layout';
import { RouterModule, Router } from '@angular/router';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
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
  usuario;
  id_usuario;
  data = [];

  constructor(private ajax: AjaxService, private user: UserService, private router: Router, private cg: ChangeDetectorRef) { 

    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
      }
    })

    this.ajax.get('motivos-cierre-chat/obtener', {}).subscribe(response => {
      if(response.success){
        this.data = response.reasons;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
    
  }

  ngOnInit() {
    
  }

  editReason(e){
    this.router.navigate(['/formulario-motivo-cierre-chat', e.idtbl_motivo_cierre_chat]);
  }

  deleteReason(e){

    swal.fire({
      title: 'Eliminar Motivo',
      text: "Confirme para pasar el motivo a estado Inactivo",
      type: 'warning',
      showCancelButton: true,
      buttonsStyling: false,
      confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
      confirmButtonText: 'Eliminar',
      cancelButtonClass: 'custom__btn custom__btn--cancel',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
     
    })
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}
