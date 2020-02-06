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
  states: EstadoExperto = {nombre: '', id_usuario_modificador: null, idtbl_estado_experto: null};
  displayedColumns = ['acciones', 'nombre', 'es_modificable'];
  dataSource: MatTableDataSource<any>;
  matTableFilter: matTableFilter;
  filterColumns = [
    { field: 'nombre', type: 'string' }];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  is_edit_timeout = false;
  filters = {};
  expert_states;

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

  /**
   * inicializa la informacion necesaria
   */
  init() {
    this.getAllStates();
  }

  /**
   * obtiene todos los estados que puede tener un experto
   */
  getAllStates() {
    this.estado_experto_service.getAllStates().then((result) => {
      this.expert_states = result;
      this.createTable(this.expert_states);
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
    this.cg.detectChanges();
    this.matTableFilter = new matTableFilter(this.dataSource,this.filterColumns);
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  /**
   * crea un nuevo estado de inactividad
   */
  createState() {
    if(this.states.nombre == '') {
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
      this.states.id_usuario_modificador = this.user.getId();
      this.estado_experto_service.createState(this.states).then(id => {
        this.init();
        this.create_state = false;
        this.states.nombre = '';
      });
    } 
  }

  /**
   * actualiza un estado de inactividad
   * @param e 
   */
  updateState(e){
    e.update = false;
    e.id_usuario_modificador = this.user.getId();
    this.estado_experto_service.updateState(e).then((result) => {
      this.getAllStates();
    });
  }

  /**
   * desactiva un estado de inactividad
   * @param e 
   */
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
      if (result.value) {
        this.estado_experto_service.deleteState(this.user.getId(), e.idtbl_estado_experto).then((result) => {
          this.getAllStates();
        });
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
   * filtra los valores de la tabla por estado
   * @param name 
   * @param event 
   */
  filterData(name, event) {
    if (event.value == 'todos') {
      this.createTable(this.expert_states);
    } else {
      this.filters[name] = event.value;
      let newArray = this.expert_states;
      for (const key in this.filters) {
        newArray = newArray.filter(element => {
          return element[key] == this.filters[key];
        });
      }
      this.createTable(newArray);
    }
  }

}

