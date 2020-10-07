import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'SearchPipe'
})

export class SearchPipe implements PipeTransform {
    transform(value: any, args?: any): any {

        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter(function(item){
            return (item['ProductName'].trim().toLowerCase().includes(args) || item['ProductDetail'].trim().toLowerCase().includes(args));
        });
    }
}