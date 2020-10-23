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
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var case_model_1 = require("../case.model");
var http_1 = require("@angular/common/http");
var CaseShowComponent = /** @class */ (function () {
    function CaseShowComponent(route, service, http, MyUrl, modalService, fb, router) {
        var _this = this;
        this.route = route;
        this.service = service;
        this.http = http;
        this.MyUrl = MyUrl;
        this.modalService = modalService;
        this.fb = fb;
        this.router = router;
        this.figPath = [];
        this.changeFigNamemessage = false;
        this.deleteFigmessage = false;
        route.params.subscribe(function (params) { _this.id = params['id']; });
        /**
         * newfigpath 是重新输入图片路径的文本框 需要验证 不为空&字符串格式两项格式
         */
        this.form = new forms_1.FormGroup({
            newfigpath: new forms_1.FormControl('', [
                forms_1.Validators.required,
                forms_1.Validators.pattern('^[\-0-9a-zA-Z]+_[\-0-9a-zA-Z]+_([1-9][0-9]*)+(\.[0-9]{1,2})?_[a-zA-Z]+$'),
            ])
        });
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
                // 如果图片是空的，那就不要加到显示里面去。
                if (data['figs'][i] != '') {
                    _this.figPath.push(_this.MyUrl + "/figs/" + data['figs'][i]);
                }
            }
        });
    };
    /**
     * 图片数组进行排序
     * @param: 文件路径 是个string数组
     * @return: void
     */
    CaseShowComponent.prototype.Sort = function (figpath) {
        var length = figpath.length;
        console.log(this.figPath);
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
    /**
     * 删除图片
     * @param filename
     * @return void
     */
    CaseShowComponent.prototype.deletePicture = function () {
        var _this = this;
        this.service.deleteFigure(this["case"].id, this.tempfigpath).subscribe(function (judge) {
            if (judge) {
                _this.deleteOrchange = 1;
            }
            _this.deleteFigmessage = true;
            _this.openCheck();
        });
    };
    /**
     * 打开修改名称窗口
     * @param: template
     * @param 输入图片路径 string
     * @return :void
     */
    CaseShowComponent.prototype.openChangeNameModal = function (template, figpath) {
        this.modalRef = this.modalService.show(template);
        this.tempfigpath = figpath; // 旧的figpath
        console.log('figpath', figpath);
    };
    CaseShowComponent.prototype.openDeleteModal = function (template, figpath) {
        this.tempfigpath = figpath;
        this.modalRef = this.modalService.show(template);
    };
    /**
     * 打开删除图片确认信息窗口
     */
    CaseShowComponent.prototype.openCheck = function () {
        this.modalRef = this.modalService.show(this.check);
    };
    /**
     * 输入图片名界面确认
     * 现在才发送请求去修改名称
     */
    CaseShowComponent.prototype.confirmChangeName = function () {
        var _this = this;
        this.modalRef.hide();
        console.log(this.form.controls.newfigpath.value);
        var data = new FormData();
        data.append('figpath', this.tempfigpath);
        data.append('newfigname', this.form.controls.newfigpath.value);
        this.http.patch(this.MyUrl + "/changeName/" + this.id, data, {
            headers: new http_1.HttpHeaders().set('Access-Control-Allow-Origin', '*')
        }).subscribe(function (check) {
            if (check) {
                _this.changeFigNamemessage = true;
            }
            // 调出框来
            _this.deleteOrchange = 2;
            _this.openCheck();
        });
    };
    /**
     * 界面取消等操作
     */
    CaseShowComponent.prototype.decline = function () {
        this.modalRef.hide();
        // 如果成功就刷新当前页面。
        if (this.changeFigNamemessage || this.deleteFigmessage) {
            window.location.reload();
            // this.destination.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
        }
    };
    __decorate([
        core_1.ViewChild('deleteFig')
    ], CaseShowComponent.prototype, "deleteModal");
    __decorate([
        core_1.ViewChild('check')
    ], CaseShowComponent.prototype, "check");
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
