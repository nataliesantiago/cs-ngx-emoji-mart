import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';
import { UtilsService } from './utils.service';

import Block from "quill/blots/block";
import Inline from "quill/blots/inline";



@Injectable({
  providedIn: 'root'
})
export class QuillService {
  editor;
  constructor(private ajax: AjaxService, private utilService: UtilsService) { }

  fileVideoHandler(a): Promise<any> {
    return new Promise(resolve => {
      this.editor = a;
      this.utilService.abrirPickerDrive().then(archivo => {
        //// console.log(archivo);
        const range = this.editor.getSelection();
        let url = (archivo.mimeType.indexOf('google-apps') != (-1)) ? archivo.embedUrl + '?' : archivo.embedUrl;
        url += '&&iconodrive=' + archivo.iconUrl;
        this.editor.insertEmbed(range.index, 'video', `${url}`, 'user');
        //this.editor.insertText(range.index+2,' ')
        //// console.log(this.editor.getText());
        //let html = `<p><iframe src="${url}" class="archivo-drive-embedido"></iframe></p>`;
        //let delta = this.editor.clipboard.convert(html);
        //this.editor.insertText(range.index, html); 
        //resolve();
      });
    });
  }

  fileStorageHandler(a): Promise<any> {
    // console.log('paso')
    return new Promise(resolve => {
      this.editor = a;
      this.selectLocalImage(resolve);
    });
  }

  selectLocalImage(resolve) {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    // Listen upload local image and save to server
    input.onchange = () => {
      const file = input.files[0];
      // file type is only image.
      if (/^image\//.test(file.type) || /^video\//.test(file.type)) {
        this.saveToServer(file, resolve);
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
  saveToServer(file: File, resolve) {
    const range = this.editor.getSelection();
    var resultado = this.editor.insertEmbed(range.index, 'image', '/assets/images/loading-image.gif');

    const fd = new FormData();
    fd.append('archivo', file);
    this.ajax.postData('preguntas/cargar-imagen', fd).subscribe(d => {
      if (d.success) {
        this.insertToEditor(range.index, d.archivo.url, d.archivo.tipo_archivo, resolve);

      }
    });
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  insertToEditor(rango, url: string, tipo_archivo: number, resolve) {
    // push image url to rich editor.
    this.editor.deleteText(rango, 1);
    const range = this.editor.getSelection();
    if (tipo_archivo === 1) {
      this.editor.insertEmbed(range.index, 'image', `${url}`, 'user');
    } else if (tipo_archivo === 2) {
      this.editor.insertEmbed(range.index, 'video', `${url}`, 'user');
    }

    resolve();
  }

}
