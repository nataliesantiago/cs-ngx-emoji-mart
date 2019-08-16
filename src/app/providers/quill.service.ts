import { Injectable } from '@angular/core';
import { AjaxService } from './ajax.service';

@Injectable({
  providedIn: 'root'
})
export class QuillService {
  editor;
  constructor(private ajax: AjaxService) { }

  fileStorageHandler = (a)=>{
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
    const fd = new FormData();
    fd.append('image', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/upload/image', true);
    xhr.onload = () => {
      if (xhr.status === 200) {
        // this is callback data: url
        const url = JSON.parse(xhr.responseText).data;
        this.insertToEditor(url);
      }
    };
    xhr.send(fd);
  }

  /**
   * Step3. insert image url to rich editor.
   *
   * @param {string} url
   */
  insertToEditor(url: string) {
    // push image url to rich editor.
    const range = this.editor.getSelection();
    this.editor.insertEmbed(range.index, 'image', `http://localhost:8080${url}`);
  }

}
