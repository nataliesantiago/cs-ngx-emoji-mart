import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { User } from '../../schemas/user.schema';
import { UserService } from '../providers/user.service';
import { HistorialChatService } from '../providers/historial-chat.service';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { matTableFilter } from '../../common/matTableFilter';
import { DialogoDetalleChatComponent } from './dialogo-detalle-chat/dialogo-detalle-chat.component';

@Component({
  selector: 'app-historial-chat',
  templateUrl: './historial-chat.component.html',
  styleUrls: ['./historial-chat.component.scss']
})
export class HistorialChatComponent implements OnInit {

  user: User;
  displayedColumns = ['acciones', 'nombre', 'fecha_creacion', 'estado', 'producto', 'busqueda'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'nombre', type: 'string' },
    { field: 'fecha_creacion', type: 'string' },
    { field: 'estado', type: 'string' },
    { field: 'producto', type: 'string' },
    { field: 'busqueda', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  column_user;

  constructor(private user_service: UserService, private historial_service: HistorialChatService, private change_detector: ChangeDetectorRef, public dialog: MatDialog) {
    this.user = this.user_service.getUsuario();
    if (this.user) {
      this.init();
    }
    this.user_service.observableUsuario.subscribe(u => {
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
    if (this.user.getIdRol() == 2) {
      this.column_user = 'Nombre Cliente';
      this.getExpertChat();
    } else {
      this.column_user = 'Nombre Experto';
      this.getClientChat();
    }
  }

  createTable(result) {
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.change_detector.detectChanges();
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
  }

  getExpertChat() {
    this.historial_service.getExpertChats(this.user.getId()).then(result => {
      this.createTable(result);
    });
  }

  getClientChat() {
    this.historial_service.getClientChats(this.user.getId()).then(result => {
      this.createTable(result);
    });
  }

  showMoreChat(row) {
    let user_id = this.user.getId();
    this.dialog.open(DialogoDetalleChatComponent, {
      panelClass: 'dialog-chat',
      width: '550px',
      height: '90vh',
      data: { ...row, user_id }
    });
    
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}