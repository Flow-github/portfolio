import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SendMessageRequest {

    private baseUrl = './assets/php/sendMessage.php';
    private header:any = {};

    constructor(private http:HttpClient){
        this.header.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    }

    sendMessage(messageData:any){
        return this.http
                    .post(this.baseUrl, messageData, {headers: this.header.headers});
                    //.subscribe((res:Response) => res.json());
    }

}