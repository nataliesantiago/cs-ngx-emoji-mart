import * as GibberishAES from 'dz-gibberish-aes/dist/gibberish-aes-1.0.0.js';

export class Cifrado {
    sendedKey: Readonly<String> = "DvC1=2D4ns3n&41R0mpRr?¿";

    constructor() {
        
    }

    dec(data){
        return GibberishAES.dec(atob(data),this.sendedKey);
    }

    enc(data){
        return btoa(GibberishAES.enc(data,this.sendedKey));
    }
};