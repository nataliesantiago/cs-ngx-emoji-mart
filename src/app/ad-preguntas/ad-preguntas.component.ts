import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ad-preguntas',
  templateUrl: './ad-preguntas.component.html',
  styleUrls: ['./ad-preguntas.component.css']
})
export class AdPreguntasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  settings = {
    columns: {
      id: {
        title: 'ID',
        filter: false
      },
      name: {
        title: 'Full Name',
        filter: false
      },
      username: {
        title: 'User Name',
        filter: false
      },
      email: {
        title: 'Email',
        filter: false
      }
    },
    edit: {
      editButtonContent: '<i class="ti-pencil text-info m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="ti-trash text-danger m-r-10"></i>',
      saveButtonContent: '<i class="ti-save text-success m-r-10"></i>',
      cancelButtonContent: '<i class="ti-close text-danger"></i>'
    }
  };

}

