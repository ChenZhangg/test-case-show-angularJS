import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { CaseListComponent } from './case-list/case-list.component';
import { CaseShowComponent } from './case-show/case-show.component';
import { CaseFormComponent } from './case-form/case-form.component';
import { CaseEditComponent } from './case-edit/case-edit.component';
import { CaseNewComponent } from './case-new/case-new.component';

const routes: Routes = [
  { path: '', redirectTo: 'testCases', pathMatch: 'full' },
  { path: 'testCases', component: CaseListComponent },
  { path: 'testCases/new', component: CaseNewComponent },
  { path: 'testCases/:id', component: CaseShowComponent },
  { path: 'testCases/:id/edit', component: CaseEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
