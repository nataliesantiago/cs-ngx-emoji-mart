import { Component } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  subtitle: string;

  constructor() {
    this.subtitle = 'This is some text within a card block.';
  }
}


