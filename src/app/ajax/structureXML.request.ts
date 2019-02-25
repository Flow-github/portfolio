import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class StructureRequest {

    public structureXmlLoaded:EventEmitter<any>;

    private baseUrl = './assets/xml/content.xml';
    private header:any = {};

    constructor(private http:HttpClient){
        this.header.headers = new HttpHeaders({ 'Content-Type': 'text/xml' });

        this.structureXmlLoaded = new EventEmitter();
    }

    getStructureXML(){
        return this.http
                    .get(this.baseUrl);
                    //.subscribe((res:Response) => res.json());
    }

}