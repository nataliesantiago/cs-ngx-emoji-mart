import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatChipInputEvent } from '@angular/material';
import { User } from '../../schemas/user.schema';
import swal from 'sweetalert2';
import { matTableFilter } from '../../common/matTableFilter';
import { UserService } from '../providers/user.service';
import { EstadoExpertoService } from '../providers/estado-experto.service';
import { EstadoExperto } from '../../schemas/interfaces';

@Component({
  selector: 'app-ad-estado-experto',
  templateUrl: './ad-estado-experto.component.html',
  styleUrls: ['./ad-estado-experto.component.scss']
})
export class AdEstadoExpertoComponent implements OnInit {

  user: User;
  create_state = false;
  states: EstadoExperto = {nombre: '', es_modificable: ''};
  displayedColumns = ['acciones', 'nombre', 'es_modificable'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'nombre', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  is_edit_timeout = false;

  constructor(private userService: UserService, private estado_experto_service: EstadoExpertoService, private cg: ChangeDetectorRef) {
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
    this.getAllStates();
  }

  getAllStates() {
    this.estado_experto_service.getAllStates().then((result) => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cg.detectChanges();
      this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    });
  }

  onChangeState(event) {
    this.states.es_modificable = event.value;
  }

  createState() {
    if(this.states.nombre == '' || this.states.es_modificable == '') {
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
      // this.message.id_usuario_modificacion = this.user.getId();
      // this.mensajeAutomatico.createMessage(this.message).then(id => {
      //   this.init();
      //   this.create_state = false;
      // })
    } 
  }

  updateState(e){
    // e.update = false;
    // e.id_usuario_modificacion = this.user.getId();
    // this.mensajeAutomatico.updateMessage(e).then((result) => {
    //   this.getAllStates();
    // });
  }

  inactiveState(e){
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
      // if (result.value) {
      //   this.mensajeAutomatico.inactiveMessage(e.idtbl_mensaje_automatico_chat).then((result) => {
      //     this.getAllStates();
      //   });
      // }
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}

