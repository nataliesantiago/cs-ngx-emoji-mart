import { MatTableDataSource } from '@angular/material';
import * as _moment from 'moment-timezone';
import { default as _rollupMoment } from 'moment-timezone';
const moment = _rollupMoment || _moment;

export class matTableFilter{
    dataSource:MatTableDataSource<any>;
    filterColumns:Array<any>;
    constructor(d:MatTableDataSource<any>, f:Array<any>){
      this.dataSource = d;
      this.filterColumns = f;
      let self = this;
      let columnsLegth = this.filterColumns.length;
      this.dataSource.filterPredicate = function (data, filter: string): boolean {
        for (let i =0;i<columnsLegth;i++){
          let campo = self.filterColumns[i];
          let titulo = campo.field;
          let tipo = campo.type;
          if (data[titulo] !== false && data[titulo]!=0)
            if (!(data[titulo] && data[titulo]!==null))
              continue;
          switch(tipo){
            case 'number':
              if (data[titulo].toString().toLowerCase().includes(filter))
                return true;
              break;
            case 'string':
              if (data[titulo].toString().toLowerCase().includes(filter))
                return true;
              break;
            case 'date':
              if (moment(new Date(data[titulo])).format('MMM DD, YYYY').toLowerCase().includes(filter))
                return true;
              break;
            case 'boolean':
              for (var key in campo.values) {
                if (campo.values.hasOwnProperty(key) 
                  && data[titulo].toString()==key.toString() && campo.values[key].toLowerCase().includes(filter)) {
                    return true;
                }
              }
              break;
            default:
              break;
          }
        }
        return false;
      };
    }
}