import { Directive, OnInit, ElementRef } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
    selector: '[my-formControl]'
    })

    export class NativeElementInjectorDirective implements OnInit {

        constructor (private el: ElementRef, private control : NgControl) {
           
        }

        ngOnInit(){
            (this.control.control as any).nativeElement = this.el.nativeElement;
        }
    }