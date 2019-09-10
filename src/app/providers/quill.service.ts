import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  editor;
  constructor(private ajax: AjaxService) { }

  fileStorageHandler = (a) => {
    
    this.editor = a;
    this.selectLocalImage();

  }

  selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type) || /^video\//.test(file.type)) {
        this.saveToServer(file);
      } else {
        console.warn('You could only upload images.');
      }
    };
  }

  /**
   * Step2. save to server
   *
   * @param {File} file
   */
  saveToServer(file: File) {
    const range = this.editor.getSelection();
    var resultado = this.editor.insertEmbed(range.index, 'image', '/assets/images/loading-image.gif');
    
    const fd = new FormData();
    fd.append('archivo', file);
    this.ajax.postData('preguntas/cargar-imagen', fd).subscribe(d => {
      if (d.success) {
        this.insertToEditor(range.index, d.archivo.url, d.archivo.tipo_archivo);
      }
    });
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  insertToEditor(rango, url: string, tipo_archivo: number) {
    // push image url to rich editor.
    this.editor.deleteText(rango, 1);
    const range = this.editor.getSelection();
    if (tipo_archivo === 1) {
      this.editor.insertEmbed(range.index, 'image', `${url}`);
  } else if (tipo_archivo === 2) {
      this.editor.insertEmbed(range.index, 'video', `${url}`);
  }
    
  }

}
