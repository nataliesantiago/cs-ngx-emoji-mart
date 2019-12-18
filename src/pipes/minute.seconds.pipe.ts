import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'minuteSeconds',
    pure: false
})
export class MinuteSecondsPipe implements PipeTransform {

    transform(value: number): string {
        // console.log(value);
        let minutes: any = Math.floor(value / 60);
        let seconds: any = Math.floor(value % 60);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        let result = minutes + ":" + seconds;
        return result;
    }

}