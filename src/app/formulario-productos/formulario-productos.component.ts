import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { UserService } from '../providers/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillService } from '../providers/quill.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}



/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-formulario-productos',
  templateUrl: './formulario-productos.component.html',
  styleUrls: ['./formulario-productos.component.scss']
})
export class FormularioProductosComponent implements OnInit {

  usuario;
  id_usuario;
  productos = [];
  displayedColumns = ['id', 'nombre', 'acciones'];
  myControl = new FormControl();
  options = [];
  filteredOptions: Observable<string[]>;
  arbol = [];
  arbol_mostrar = [];
  producto_padre_seleccionado = "";
  categoria = { id_producto_padre: '', nombre: '', nombre_icono: ''}
  icons = [];
  file: any;
  impresion = [];

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private ajax: AjaxService, private user: UserService, private route: ActivatedRoute, private router: Router, private cg: ChangeDetectorRef, private qs: QuillService, private http: HttpClient) { 

    this.usuario = user.getUsuario();
    
    this.ajax.get('user/obtenerUsuario', { correo: this.usuario.correo}).subscribe(d => {
      if(d.success){
        this.id_usuario = d.usuario[0].idtbl_usuario;        
      }
    });

    this.cargarIcons();

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.ajax.get('producto/obtener', {}).subscribe(p => {
      if(p.success){
        this.productos = p.productos;
        this.options = p.productos;
        /*for(let i = 0; i < p.preguntas.length; i++){
          this.options.push(p.preguntas[i].titulo);
        }*/
        
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );                           
      }
    })

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

  seleccionarProducto(e){
    this.categoria.id_producto_padre = e.idtbl_producto;
    this.arbol = [];
    this.arbol_mostrar = [];
    this.producto_padre_seleccionado = e.idtbl_producto;
    this.myControl = new FormControl(e.nombre);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.cg.detectChanges();
    this.arbol.push(e);
    this.crearArbol(e);    
    
  }

  crearArbol(e){
    let producto_actual;
    let productos_hijo = [];
    if(e.id_producto_padre != null){
      this.ajax.get('producto/obtener-padre', { idtbl_producto : e.id_producto_padre }).subscribe(p => {
        if(p.success){
          producto_actual = p.producto[0];
          this.arbol.push(producto_actual);
          this.crearArbol(producto_actual);
        }
      })
    }else{
      
      this.ajax.get('producto/obtener-hijos', { idtbl_producto : this.producto_padre_seleccionado }).subscribe(p => {
        if(p.success){
          productos_hijo = p.producto;
          console.log(productos_hijo);
          for(let i = this.arbol.length - 1; i >= 0; i--){
            this.arbol_mostrar.push(this.arbol[i]);
          }
    
          let json_arbol = [];
    
          for(let i = 0; i < this.arbol_mostrar.length; i++){
            json_arbol.push({name: this.arbol_mostrar[i].nombre, id: this.arbol_mostrar[i].idtbl_producto, id_padre: this.arbol_mostrar[i].id_producto_padre});
          }

          for(let i = 0; i < productos_hijo.length; i++){
            json_arbol.push({name: productos_hijo[i].nombre, id: productos_hijo[i].idtbl_producto, id_padre: productos_hijo[i].id_producto_padre});
          }
    
          let TREE_DATA: FoodNode[] = [];
    
          TREE_DATA.push({ name: this.arbol_mostrar[0].nombre });
    
          for(let i = 1; i < this.arbol_mostrar.length; i++){
    
          }
    
          /*prueba = [
            { name: 'Producto 1', id: 1, id_padre: null },
            { name: 'Subproducto 1', id: 2, id_padre: 1 },
            { name: 'solucion 1', id: 3, id_padre: 2 }
          ]*/
          
          let topManager = this.employeesForManager(json_arbol, null)[0]
          let result = this.giveShape(json_arbol, topManager)  
          
          console.log(result)
            
          TREE_DATA = [result];
          
          console.log(TREE_DATA)
          this.dataSource.data = TREE_DATA;
          this.cg.detectChanges();
        }
      })

    }
  }

employeesForManager(employees, managerName) {
    var res = []
    for (var i = 0; i < employees.length; i++) {
        if (employees[i].id_padre == managerName) {
            res.push(employees[i])
        }
    }
    return res
}

giveShape(employees, manager) {
    var immediateEmployees = this.employeesForManager(employees, manager.id)
    var children = []
    for (var i = 0; i < immediateEmployees.length; i++) {
        children.push(this.giveShape(employees, immediateEmployees[i]))
    }
    // create a new object to avoid mutating original data
    return {
        name: manager.name,
        id: manager.id,
        children: children       
    }
}



  cargarIcons(){
    this.icons = [];
    let csv;
    this.http.get('assets/icons/iconos-material.csv', {responseType: 'text'})
        .subscribe(data =>  { 
          csv = data 
          this.icons = csv.split(/\r\n|\n/);
        } 
    );
  }

  guardarProducto(){
    this.ajax.post('producto/guardar', { producto: this.categoria }).subscribe(d => {
      if(d.success){
        console.log(d.producto);
        this.router.navigate(['/productos']);
      }
    })
  }

}
