import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './route/app-routing.module';
import { StructureComponent } from './structure/structure.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './page/home/home.component';
import { WorkComponent } from './page/work/work.component';
import { ContactComponent } from './page/contact/contact.component'
import { PageNotFoundComponent } from './page/pageNotFound/pageNotFound.component';
import { StructureRequest } from './ajax/structureXML.request';
import { SendMessageRequest } from './ajax/SendMessage.request';
import { RouteService } from './service/route.service';
import { NativeElementInjectorDirective } from './utils/nativeElement.injector.directive';
import { HeaderComponent } from './header/header.component';
import { SafeHtmlPipe } from './utils/safehtml.pipe';

@NgModule({
  declarations: [
    StructureComponent,
    HeaderComponent,
    NavComponent,
    FooterComponent,
    HomeComponent,
    WorkComponent,
    ContactComponent,
    PageNotFoundComponent,
    NativeElementInjectorDirective,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    StructureRequest,
    SendMessageRequest,
    RouteService,
  ],
  bootstrap: [StructureComponent]
})
export class AppModule { }
