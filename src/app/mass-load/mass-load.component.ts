import { Component, OnInit, ViewChild , ChangeDetectorRef, Inject } from '@angular/core';
import { AjaxService } from '../providers/ajax.service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import swal from 'sweetalert2';

@Component({
  selector: 'app-mass-load',
  templateUrl: './mass-load.component.html',
  styleUrls: ['./mass-load.component.scss']
})
export class MassLoadComponent implements OnInit {

  active_download = false;
  file_name = '';
  csv_file:File;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  displayedColumns = ['title', 'user_id', 'create_date', 'state_id', 'details', 'create', 'errors'];
  dataSource = new MatTableDataSource([]);
  data = [];
  loading = false;
  
  constructor(private ajax: AjaxService, private change_detector: ChangeDetectorRef, public dialog: MatDialog) { 
   
  }

  ngOnInit() {
    
  }

  downloadCsvFile() {
    let csv_headers = [
      ['Pregunta,Respuesta,Correo_usuario_creador,Fecha_creacion,Correo_usuario_ultima_modificacion,Fecha_ultima_modificacion,Identificador_producto,Estado,Estado_flujo,Muestra_fecha_actualizacion'],
      [',,,,,,,,,0']
    ];
    let universalBOM = "\uFEFF";
    let csv_content = csv_headers.map(e => e.join(",")).join("\n");

    // let csv_blob = new Blob(["\uFEFF"+csv_content], {
    //   type: 'text/csv; charset=utf-8'
    //   });
    // let link = document.createElement("a");
    // link.download = "formato-preguntas-respuestas.csv";
    // link.href = window.URL.createObjectURL(csv_blob);

    let link = document.createElement("a");
    link.href = 'data:text/csv; charset=utf-8,%EF%BB%BF' + encodeURIComponent(csv_content);
    link.download = "formato-preguntas-respuestas.csv";
    window.document.body.appendChild(link);
    link.click();
    this.active_download = true;
  }

  uploadCsvFile(event) {
    let extension = event.target.files[0].name.split('.').pop().toLowerCase();
    if(extension == 'csv') {
      this.csv_file = event.target.files[0];
      this.file_name = this.csv_file.name;
    } else {
      this.showExtensionAlert(event);
    }
  }

  showExtensionAlert(event) {
    swal.fire({
      title: 'Formato no permitido',
      text: "Formato del archivo no permitido, por favor suba un archivo .csv",
      type: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    }).then((result) => {
      if(result.value) {
        event.srcElement.value = null;
        this.file_name = '';
        this.csv_file = null;
      }
    });
  }

  sendCsvFile() {
    if(this.csv_file != undefined || this.csv_file != null) {
      this.loading = true;
      const form_data = new FormData();
      form_data.append('csv_file', this.csv_file);
      this.ajax.postData('preguntas/cargar-archivo', form_data).subscribe(data => {
        if (data.success == true) {          
          this.data = data.questions;
          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.change_detector.detectChanges();  
          this.loading = false;
        } else {
          
        }
        
      });
    }   
  }

  moreInfo(row) {
    let action = 'show_details';
    this.dialog.open(DialogOverviewDetailQuestion, {
      width: '600px',
      height: '90vh',
      data: {...row, action}
    });
  }

  showErrors(row) {
    let action = 'show_errors';
    this.dialog.open(DialogOverviewDetailQuestion, {
      width: '600px',
      height: '90vh',
      data: {...row.errors, action}
    });
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

}

@Component({
  selector: 'detail-question-dialog',
  templateUrl: 'detail-question-dialog.html',
  styleUrls: ['./mass-load.component.scss']
})

export class DialogOverviewDetailQuestion {

  data_question;
  keys;
  constructor(public dialogRef: MatDialogRef<DialogOverviewDetailQuestion>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.keys = Object.keys(data).filter(element => {
      return element != 'action' && element != 'errors';
    });
    this.data_question = data;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}