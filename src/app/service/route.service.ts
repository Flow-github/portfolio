import { Injectable, EventEmitter } from '@angular/core';

@Injectable()

export class RouteService{

    public routeStartChange:EventEmitter<any>;
    public pageClose:EventEmitter<any>;
    public routeChanged:EventEmitter<any>;

    constructor(){
        this.routeStartChange = new EventEmitter();
        this.pageClose = new EventEmitter();
        this.routeChanged = new EventEmitter();
    }

}