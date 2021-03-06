import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaseItemComponent } from './case-item/case-item.component';
import { CaseListComponent } from './case-list/case-list.component';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { CaseShowComponent } from './case-show/case-show.component';
import { CaseFormComponent } from './case-form/case-form.component';
import { CaseService } from './case.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CaseNewComponent } from './case-new/case-new.component';
import { CaseEditComponent } from './case-edit/case-edit.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';


@NgModule({
  declarations: [
    AppComponent,
    CaseItemComponent,
    CaseListComponent,
    CaseShowComponent,
    CaseFormComponent,
    CaseNewComponent,
    CaseEditComponent,
  ],
  imports: [
    // NgbModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: CaseService, useClass: CaseService },
    // 生产环境 rest处理请求
    { provide: 'REST_URL', useValue: 'http://10.176.34.86:8090/api/testCases'},
    // 开发环境 rest处理请求
    // { provide: 'REST_URL', useValue: 'http://localhost:8090/api/testCases'},
    // 生产环境 处理请求
    { provide: 'MY_URL', useValue: 'http://10.176.34.86:8090/testCases'},
    // 开发环境 处理请求
    // { provide: 'MY_URL', useValue: 'http://localhost:8090/testCases'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
