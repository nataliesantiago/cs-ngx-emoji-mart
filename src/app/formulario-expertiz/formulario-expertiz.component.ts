import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { HttpClient } from '@angular/common/http';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import swal from 'sweetalert2';
import { UtilsService } from '../providers/utils.service';

@Component({
  selector: 'app-formulario-expertiz',
  templateUrl: './formulario-expertiz.component.html',
  styleUrls: ['./formulario-expertiz.component.scss']
})
export class FormularioExpertizComponent implements OnInit {

  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  usuario;
  id_usuario;
  productos=[];
  id_expertiz;
  expertiz = { nombre: ''};
  displayedColumns = ['id', 'categoria', 'acciones'];
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  dataSource = new MatTableDataSource([]);
  producto_asociado = [];
  editar = false;
  @Input() public validar_seccion: number;
  @Output() public respuesta_componente = new EventEmitter<boolean>();

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, 
              private qs: QuillService, private http: HttpClient, private utilsService: UtilsService){
    
    this.usuario = this.user.getUsuario();
    if (this.usuario) {
      this.id_usuario = this.usuario.idtbl_usuario;
      this.init();
    }
    this.user.observableUsuario.subscribe(u => {
      this.usuario = u;
      this.id_usuario = u.idtbl_usuario;
      if (this.usuario) {
        this.init();
      }
    })

  }

  init(){

    this.route.params
    .filter(params => params.id_expertiz)
    .subscribe(params => {
      

      this.id_expertiz = params.id_expertiz;
      
    });

    this.ajax.get('producto/obtener', {}).subscribe(p => {
      if(p.success){
        this.productos = p.productos;
        this.options = p.productos;
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this.utilsService.filter(this.productos, value, 'nombre'))
        );
      }
    });

    if(this.id_expertiz != "nuevo" && this.id_expertiz){
      this.editar = true;
      this.ajax.get('experticia/obtener-experticia', {id_experticia: this.id_expertiz}).subscribe(p => {
        if(p.success){
          this.expertiz = p.experticia[0];
          this.expertiz = this.expertiz[0];
          this.producto_asociado = p.experticia[1];
          this.createTable(this.producto_asociado);
          this.cg.detectChanges();
        }
      });
    }
  }

  createTable(data) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key]);
      }, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const transformedFilter = filter.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    }
  }

  private _filter(value: any): string[] {
    
    if(value.nombre){
      const filterValue = value.nombre.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }else{
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.nombre.toLowerCase().indexOf(filterValue) === 0);
    }
    
  }

  anadirPreguntaAsociada(e){
    this.producto_asociado.push(e);
    this.createTable(this.producto_asociado);
    this.myControl = new FormControl(e.nombre);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
  }

  borrarElemento(e){

    swal.fire({
      title: 'Desvincular Categoría',
      text: "Confirme para desvincular la categoría",
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
        if(this.editar){
          
          if(e.idtbl_producto != undefined){
            this.ajax.post('experticia/eliminar-asociacion', { categoria_asociada: e }).subscribe(d => {
              if(d.success){
                let pos = 0;
                for(let i = 0; i < this.producto_asociado.length; i++){
                  if(this.producto_asociado[i].idtbl_producto == e.idtbl_producto){
                    pos = i;
                  }
                }
                this.producto_asociado.splice(pos,1);
                this.createTable(this.producto_asociado);
                this.cg.detectChanges();
              }
            })
          }else{
            let pos = 0;
            for(let i = 0; i < this.producto_asociado.length; i++){
              if(this.producto_asociado[i].idtbl_producto == e.idtbl_producto){
                pos = i;
              }
            }
            this.producto_asociado.splice(pos,1);
            this.createTable(this.producto_asociado);
            this.cg.detectChanges();
          }
        }else{
          let pos = 0;
          for(let i = 0; i < this.producto_asociado.length; i++){
            if(this.producto_asociado[i].idtbl_producto == e.idtbl_producto){
              pos = i;
            }
          }
          this.producto_asociado.splice(pos,1);
          this.createTable(this.producto_asociado);
          this.cg.detectChanges();
        }
      }
    })
  }

  enviarDato(){

    if(this.expertiz.nombre == ""){

      swal.fire({
        title: 'Digite el nombre de la experticia',
        text: '',
        type: 'warning',
        buttonsStyling: false,
        confirmButtonClass: 'custom__btn custom__btn--accept m-r-20',
        confirmButtonText: 'Aceptar',
        customClass: {
          container: 'custom-sweet'
        }
      })

    }else{

      if(this.editar){
      
        this.ajax.post('experticia/editar', { expertiz: this.expertiz, productos_asociados: this.producto_asociado }).subscribe(d => {
          if(d.success){
          
            this.router.navigate(['/ad-expertiz']);
          }
        })
      }else{
        
        this.ajax.post('experticia/guardar', { expertiz: this.expertiz, productos_asociados: this.producto_asociado }).subscribe(d => {
          if(d.success){
            if(this.validar_seccion){
              this.respuesta_componente.emit(true);
              this.expertiz = { nombre: ''};
              this.producto_asociado = [];
            }else{
              this.router.navigate(['/ad-expertiz']);
            }
          }
        })
      }

    }
    
  }

  volver(){
    if(this.validar_seccion){
      this.respuesta_componente.emit(true);
      this.expertiz = { nombre: ''};
      this.producto_asociado = [];
    }else{
      this.router.navigate(['/ad-expertiz']);
    }
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

  ngOnInit() {

  }

}
