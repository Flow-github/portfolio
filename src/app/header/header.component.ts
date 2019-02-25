import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RouteService } from "../service/route.service";

@Component({
    selector: 'header-root',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit{

    @ViewChild('homeButton') buttonHome: ElementRef;
    @ViewChild('contactButton') buttonContact: ElementRef;
    @ViewChild('linkedinButton') buttonLinkedIn: ElementRef;

    constructor(private routeService:RouteService){

    }

    ngOnInit(){
        this.buttonHome.nativeElement.addEventListener('click', (e:MouseEvent) => {this.clickToHome(e)});
        this.buttonContact.nativeElement.addEventListener('click', (e:MouseEvent) => {this.clickToContact(e)});
        this.buttonLinkedIn.nativeElement.addEventListener('click', (e:MouseEvent) => {this.clickToLinkedIn(e)});
    }

    private clickToHome(e:MouseEvent){
        this.routeService.routeStartChange.emit('/home');
    }

    private clickToContact(e:MouseEvent){
        this.routeService.routeStartChange.emit('/contact');
    }

    private clickToLinkedIn(e:MouseEvent){
        window.open('https://fr.linkedin.com/in/florent-ciret-73601628', '_blank');
    }

}