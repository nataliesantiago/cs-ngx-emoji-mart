import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  editor;
  constructor(private ajax: AjaxService) { }

  fileStorageHandler = (a)=>{
    console.log("Entra al quillService");
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
      if (/^image\//.test(file.type)) {
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
    console.log(resultado);
    const fd = new FormData();
    fd.append('image', file);
    console.log(file);
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      let tmp = reader.result.split(',');
      console.log(tmp);
      let archiv_string = tmp[1];
      let tmp2 = tmp[0].split(';');
      let tmp3 = tmp2[0].split(':');
      let mime_type = tmp3[1];
      console.log(file.name);
      let tmp4 = file.name.split('.');
      console.log(tmp4);
      let extension = tmp4[tmp4.length - 1];
      let file_enviar = { datos: archiv_string, mime: mime_type, ext: extension, name: tmp4[0] };
      //this.ajax.post('admin/crear/categoria', datos).subscribe(data => { console.log(data) });
      console.log(file_enviar);
      this.ajax.post('preguntas/cargar-imagen', {file: file_enviar}).subscribe(d => {
        if(d.success){
          console.log(d.url);
              this.insertToEditor(range.index, d.url);
        }
      })
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
    
    
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  insertToEditor(rango, url: string) {
    // push image url to rich editor.
    this.editor.deleteText(rango, 1);
    const range = this.editor.getSelection();
    this.editor.insertEmbed(range.index, 'image', `${url}`);
  }

}
