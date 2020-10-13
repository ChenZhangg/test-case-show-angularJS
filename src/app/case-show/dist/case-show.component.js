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
exports.CaseShowComponent = void 0;
var core_1 = require("@angular/core");
var case_model_1 = require("../case.model");
var CaseShowComponent = /** @class */ (function () {
    function CaseShowComponent(route, service, http, MyUrl) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.http = http;
        this.MyUrl = MyUrl;
        this.figPath = [];
        route.params.subscribe(function (params) { _this.id = params['id']; });
    }
    CaseShowComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.service.show(this.id).subscribe(function (data) {
            console.log(data);
            _this.Sort(data['figs']);
            _this["case"] = new case_model_1.Case({
                id: data['id'],
                repoName: data['repoName'],
                jobNumber: data['jobNumber'],
                description: data['description'],
                includeException: data['includeException'],
                includeAssertion: data['includeAssertion'],
                num: data['number'],
                causeUrl: data['causeUrl'],
                preCommit: data['preCommit'],
                currentCommit: data['currentCommit'],
                multipleCrash: data['multipleCrash'],
                crashClusterNum: data['crashClusterNum'],
                figs: data['figs'],
                logURL: data['_links']['log'],
                testItemsURL: data['_links']['testItems'],
                changedFilesURL: data['_links']['changedFiles'],
                multipleAssertion: data['multipleAssertion'],
                assertionClusterNum: data['assertionClusterNum'],
                multipleError: data['multipleError'],
                clusterNum: data['clusterNum']
            });
            for (var i in data['figs']) {
                _this.figPath.push(_this.MyUrl + "/figs/" + data['figs'][i]);
            }
        });
    };
    /*
    * 图片数组进行排序
    * @param: 文件路径 是个string数组
    * @return: void
    * */
    CaseShowComponent.prototype.Sort = function (figpath) {
        var length = figpath.length;
        var temp = new Map();
        for (var i = 0; i < length; i++) {
            var str = figpath[i];
            var val = 10; // 权值用于排序
            if (str.match('stack') != null) {
                val = 1;
            }
            else if (str.match('error')) {
                val = 1;
            }
            else if (str.match('tests') != null) {
                val = 2;
            }
            else if (str.match('cause') != null) {
                val = 3;
            }
            else if (str.match('fix') != null) {
                val = 4;
            }
            else if (str.match('case') != null) {
                val = 5;
            }
            else {
                // 还是val = 10
            }
            temp.set(str, val);
        }
        // 已经全部都添加到map里面了，然后接下去开始排序
        var arr = Array.from(temp);
        arr.sort(function (a, b) { return a[1] - b[1]; });
        for (var i = 0; i < arr.length; i++) {
            figpath[i] = arr[i][0];
        }
    };
    CaseShowComponent.prototype.ngOnChanges = function (changes) {
        console.log(changes);
        if (this["case"]) {
            this.http.get(this["case"].logURL).subscribe(function (data) {
                console.log(data);
            });
        }
    };
    /*
    * 删除图片
    * @param:当前图片的路径
    * @retrun:
    * */
    CaseShowComponent.prototype.deletePicture = function (filename) {
        this.service.deleteFigure(this["case"].id, filename);
    };
    CaseShowComponent = __decorate([
        core_1.Component({
            selector: 'app-case-show',
            templateUrl: './case-show.component.html',
            styleUrls: ['./case-show.component.css']
        }),
        __param(3, core_1.Inject('MY_URL'))
    ], CaseShowComponent);
    return CaseShowComponent;
}());
exports.CaseShowComponent = CaseShowComponent;
