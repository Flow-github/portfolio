import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { RouteService } from '../service/route.service';

@Component({
    selector: 'footer-root',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit{

    @ViewChild('contactButton') buttonContact:ElementRef;

    constructor(private routeService:RouteService){
        
    }

    ngOnInit(){
        this.buttonContact.nativeElement.addEventListener('click', (e:MouseEvent) => this.clickToContact(e));
    }

    private clickToContact(e:MouseEvent){
        this.routeService.routeStartChange.emit('/contact');
    }

}