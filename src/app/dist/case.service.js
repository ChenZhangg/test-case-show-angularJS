"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.CaseService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var case_model_1 = require("./case.model");
var CaseService = /** @class */ (function () {
    function CaseService(http, RestUrl, // rest处理
    MyUrl, location, router) {
        this.http = http;
        this.RestUrl = RestUrl;
        this.MyUrl = MyUrl;
        this.location = location;
        this.router = router;
    }
    CaseService.prototype.index = function () {
        var cases = new Array();
        this.http.get(this.RestUrl).subscribe(function (data) {
            for (var i = 0; i < data['_embedded']['testCases'].length; i++) {
                var tmp = data['_embedded']['testCases'][i];
                var c = new case_model_1.Case({
                    id: tmp['id'],
                    repoName: tmp['repoName'],
                    jobNumber: tmp['jobNumber'],
                    description: tmp['description'],
                    includeException: tmp['includeException'],
                    includeAssertion: tmp['includeAssertion'],
                    num: tmp['number'],
                    causeUrl: tmp['causeUrl'],
                    preCommit: tmp['preCommit'],
                    currentCommit: tmp['currentCommit']
                });
                cases.push(c);
            }
        });
        return cases;
    };
    /*   new(form: any): void {
        this.http.post(
          this.apiUrl,
          JSON.stringify({repoName: form.repoName,
            jobNumber: form.jobNumber,
            description: form.description,
            includeException: form.includeException,
            includeAssertion: form.includeAssertion,
            causeUrl: form.causeUrl,
            preCommit: form.preCommit,
            currentCommit: form.currentCommit,
            fixUrls: form.fixUrls,
          }),
          {headers: new HttpHeaders().set('Content-type', 'application/json')}).subscribe();
      } */
    /*
    * 创建新的案例 使用自己的controller处理请求
    * @param:
    * @return: NULL
    * */
    CaseService.prototype["new"] = function (data) {
        this.http.post(
        // 'http://10.176.34.86:8090/testCases/', data,
        // `http://localhost:8090/testCases/`, data,
        // 开发环境
        // `${this.apiUrlD}`, data,
        // 生产环境
        "" + this.MyUrl, data, {
            headers: new http_1.HttpHeaders().set('Access-Control-Allow-Origin', '*')
        }).subscribe();
    };
    /*
    *
    * @param:id
    * @return:
    * */
    CaseService.prototype.edit = function (id) {
        return this.http.get(this.RestUrl + "/" + id, {
            headers: new http_1.HttpHeaders().set('Access-Control-Allow-Origin', '*')
        });
    };
    /*
    * edit
    *
    * */
    CaseService.prototype.update = function (data, id) {
        console.log(id);
        this.http.patch(
        // `http://10.176.34.86:8090/testCases/${id}`, data,
        this.MyUrl + "/" + id, data, {
            headers: new http_1.HttpHeaders().set('Access-Control-Allow-Origin', '*')
        })
            .subscribe();
    };
    /*
    * 获取所有的案例
    * @param:
    * @return:
    * */
    CaseService.prototype.show = function (id) {
        return this.http.get(this.RestUrl + "/" + id);
    };
    /*
    * TBD
    * @param:文件名
    * @return:
    * */
    // tslint:disable-next-line:ban-types
    CaseService.prototype.getFig = function (fileName) {
        return this.http.get(this.RestUrl + "/figs/" + fileName);
    };
    /*
    * TBD
    * @param:
    * @return:
    * */
    CaseService.prototype["delete"] = function (id) {
        console.log(id);
        console.log(this.RestUrl + "/" + id);
        this.http["delete"](this.RestUrl + "/" + id).subscribe();
    };
    /*
    * 删除截图
    * @param: 文件名 string
    * @return:
    * */
    // @ts-ignore
    CaseService.prototype.deleteFigure = function (id, filepath) {
        console.log('到deletefigure 这里了！', filepath);
        return this.http["delete"](this.MyUrl + "?id=" + id + "&filepath=" + filepath);
    };
    CaseService = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject('REST_URL')),
        __param(2, core_1.Inject('MY_URL'))
    ], CaseService);
    return CaseService;
}());
exports.CaseService = CaseService;
