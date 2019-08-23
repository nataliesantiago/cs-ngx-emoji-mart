import { Pipe, PipeTransform } from '@angular/core';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;
@Pipe({
    name: 'sortDate'
})
export class SortDatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        // console.log(value);
        if (typeof args[0] === "undefined") {
            return value;
        }
        let direction = args[0][0];
        let column = args.replace('-', '');
        value.subscribe().map(data => {
            data.sort((a: any, b: any) => {
                let inicial = moment(a[column]);
                let final = moment(b[column]);
                let diff = final.diff(inicial);
                // console.log('diferencia', diff);
                return (direction === "-") ? diff : (diff * -1);
            });
        })
        return value;
    }
}