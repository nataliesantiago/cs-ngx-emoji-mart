import * as GibberishAES from 'dz-gibberish-aes/dist/gibberish-aes-1.0.0.js';
import { UtilsService } from './utils.service';


export class Cifrado {
    sendedKey: Readonly<String>;

    constructor(private utilsService: UtilsService) {

    }


    dec(data) {

        return GibberishAES.dec(atob(data), this.utilsService.sendkey);
    }

    enc(data) {
        //// console.log(this.utilsService.sendkey);
        return btoa(GibberishAES.enc(data, this.utilsService.sendkey));
    }
};