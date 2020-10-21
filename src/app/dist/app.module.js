"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var case_item_component_1 = require("./case-item/case-item.component");
var case_list_component_1 = require("./case-list/case-list.component");
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
var http_1 = require("@angular/common/http");
var common_1 = require("@angular/common");
var case_show_component_1 = require("./case-show/case-show.component");
var case_form_component_1 = require("./case-form/case-form.component");
var case_service_1 = require("./case.service");
var forms_1 = require("@angular/forms");
var case_new_component_1 = require("./case-new/case-new.component");
var case_edit_component_1 = require("./case-edit/case-edit.component");
var modal_1 = require("ngx-bootstrap/modal");
var alert_1 = require("ngx-bootstrap/alert");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                case_item_component_1.CaseItemComponent,
                case_list_component_1.CaseListComponent,
                case_show_component_1.CaseShowComponent,
                case_form_component_1.CaseFormComponent,
                case_new_component_1.CaseNewComponent,
                case_edit_component_1.CaseEditComponent,
            ],
            imports: [
                // NgbModule,
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                modal_1.ModalModule.forRoot(),
                alert_1.AlertModule.forRoot(),
            ],
            providers: [
                { provide: common_1.APP_BASE_HREF, useValue: '/' },
                { provide: case_service_1.CaseService, useClass: case_service_1.CaseService },
                // 生产环境 rest处理请求
                // { provide: 'REST_URL', useValue: 'http://10.176.34.86:8090/api/testCases'},
                // 开发环境 rest处理请求
                { provide: 'REST_URL', useValue: 'http://localhost:8090/api/testCases' },
                // 生产环境 处理请求
                // { provide: 'MY_URL', useValue: 'http://10.176.34.86:8090/testCases'},
                // 开发环境 处理请求
                { provide: 'MY_URL', useValue: 'http://localhost:8090/testCases' }
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
