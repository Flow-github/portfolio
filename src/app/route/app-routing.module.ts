import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../page/home/home.component';
import { WorkComponent } from '../page/work/work.component';
import { PageNotFoundComponent } from '../page/pageNotFound/pageNotFound.component';
import { ContactComponent } from '../page/contact/contact.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'work', redirectTo: 'work/0', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'work/:idPage', component: WorkComponent },
  { path: 'contact', component: ContactComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
