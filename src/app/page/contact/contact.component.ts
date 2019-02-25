import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouteService } from '../../service/route.service';
import { AbstractPage } from '../abstract.page.component';
import { SendMessageRequest } from 'src/app/ajax/SendMessage.request';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: '',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss'],
  })
  
  export class ContactComponent extends AbstractPage implements OnInit{

    public contactForm:FormGroup;

    constructor(routeService:RouteService, elRef:ElementRef, private formBuilder: FormBuilder, private sendMessage:SendMessageRequest){
      super(routeService, elRef);
    }

    ngOnInit() {
      super.ngOnInit();

      this.contactForm = this.formBuilder.group({
        name: ['', Validators.required],
        firstName: ['', Validators.required],
        mail: ['', [Validators.required, Validators.email]],
        message: ['', Validators.required]
      });
    }

    onSubmitForm(){
      if(this.contactForm.status == 'INVALID'){
        this.formIsInvalid();
      }else if(this.contactForm.status == 'VALID'){
        this.formIsValid();
      }
    }

    private formIsInvalid(){
      var formControl:FormControl;
      var control:string;
      for(control in this.contactForm.controls){
        formControl = this.contactForm.controls[control] as FormControl;
        if(formControl.valid){
          (formControl as any).nativeElement.style.borderLeftColor = "green";
          (formControl as any).nativeElement.style.borderLeftWidth = '2px';
        }else{
          (formControl as any).nativeElement.style.borderLeftColor = "red";
          (formControl as any).nativeElement.style.borderLeftWidth = '2px';
        }
      }
    }

    private formIsValid(){
      this.sendMessage.sendMessage(this.contactForm.value).subscribe((res:ArrayBuffer) => this.resultSaveMessage(res), (err:HttpErrorResponse) => this.resultSaveMessageError(err));;

      var formControl:FormControl;
      var control:string;
      for(control in this.contactForm.controls){
        formControl = this.contactForm.controls[control] as FormControl;
        (formControl as any).nativeElement.style.borderLeftColor = "";
        (formControl as any).nativeElement.style.borderLeftWidth = '0px';
        formControl.reset();
        (formControl as any).nativeElement.value = '';
      }
    }

    private resultSaveMessage(res:ArrayBuffer){
      console.log(res);
    }

    private resultSaveMessageError(err:HttpErrorResponse){
      console.log(err);
    }

  }