"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CaseFormComponent = void 0;
var core_1 = require("@angular/core");
var CaseFormComponent = /** @class */ (function () {
    function CaseFormComponent(fb, service, router, changeDetector) {
        this.fb = fb;
        this.service = service;
        this.router = router;
        this.changeDetector = changeDetector;
        this.files = [];
        this.editFormData = new FormData();
    }
    CaseFormComponent.prototype.ngOnChanges = function (changes) {
        if (this["case"]) {
            this.form.controls.repoName.setValue(this["case"].repoName);
            this.form.controls.jobNumber.setValue(this["case"].jobNumber);
            this.form.controls.description.setValue(this["case"].description);
            if (this["case"].includeException == true) {
                this.form.controls.includeException.setValue(this["case"].includeException);
            }
            if (this["case"].includeAssertion == true) {
                this.form.controls.includeAssertion.setValue(this["case"].includeAssertion);
            }
            this.form.controls.causeUrl.setValue(this["case"].causeUrl);
            this.form.controls.preCommit.setValue(this["case"].preCommit);
            this.form.controls.currentCommit.setValue(this["case"].currentCommit);
            if (this["case"].multipleCrash == true) {
                this.form.controls.multipleCrash.setValue(this["case"].multipleCrash);
            }
            this.form.controls.crashClusterNum.setValue(this["case"].crashClusterNum);
            if (this["case"].multipleAssertion == true) {
                this.form.controls.multipleAssertion.setValue(this["case"].multipleAssertion);
            }
            this.form.controls.assertionClusterNum.setValue(this["case"].assertionClusterNum);
            if (this["case"].multipleError == true) {
                this.form.controls.multipleError.setValue(this["case"].multipleError);
            }
            this.form.controls.clusterNum.setValue(this["case"].clusterNum);
        }
    };
    CaseFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.form = this.fb.group({
            repoName: ['', repoNameValidator],
            jobNumber: ['', jobNumberValidator],
            description: [''],
            includeException: [false],
            includeAssertion: [false],
            multipleError: [false],
            multipleCrash: [false],
            multipleAssertion: [false],
            clusterNum: [0, numberValidator],
            crashClusterNum: [0, numberValidator],
            assertionClusterNum: [0, numberValidator],
            causeUrl: [''],
            preCommit: ['', shaValidator],
            currentCommit: ['', shaValidator],
            fixUrls: this.fb.array([this.fb.control('')]),
            figs: ['']
        });
        for (var ctrl in this.form.controls) {
            if (ctrl == 'causeUrl') {
                this.form.get(ctrl).valueChanges.subscribe(function (value) {
                    var pattern = /compare\/(\S+)\.\.\.(\S*)/;
                    var result = pattern.exec(value);
                    if (result && result[1]) {
                        _this.form.controls.preCommit.setValue(result[1]);
                        _this.form.controls.currentCommit.setValue(result[2]);
                    }
                });
            }
            else {
                this.form.get(ctrl).valueChanges.subscribe(function (value) {
                    // console.log("====" + ctrl.constructor.name + ctrl);
                    // console.log(value);
                });
            }
        }
    };
    CaseFormComponent.prototype.onSubmit = function () {
        console.log('you submitted value:', this.form.value);
        var formData = new FormData();
        for (var i = 0; i < this.files.length; i++) {
            formData.append('files', this.files[i]);
        }
        var f = this.form.value;
        formData.append('repoName', f.repoName);
        formData.append('jobNumber', f.jobNumber);
        formData.append('description', f.description);
        formData.append('includeException', f.includeException);
        formData.append('includeAssertion', f.includeAssertion);
        formData.append('causeUrl', f.causeUrl);
        formData.append('preCommit', f.preCommit);
        formData.append('currentCommit', f.currentCommit);
        formData.append('fixUrls', f.fixUrls);
        formData.append('multipleCrash', f.multipleCrash);
        formData.append('crashClusterNum', f.crashClusterNum);
        formData.append('data', f);
        formData.append('multipleAssertion', f.multipleAssertion);
        formData.append('assertionClusterNum', f.assertionClusterNum);
        formData.append('multipleError', f.multipleError);
        formData.append('clusterNum', f.clusterNum);
        if (this.newOrEdit) {
            this.service["new"](formData);
        }
        else {
            this.service.update(formData, this.id);
        }
        this.router.navigate(['testCases']);
        // 这里？？？？更新视图？
        this.changeDetector.detectChanges();
    };
    Object.defineProperty(CaseFormComponent.prototype, "fixUrls", {
        get: function () {
            return this.form.get('fixUrls');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CaseFormComponent.prototype, "figs", {
        get: function () {
            return this.form.get('logFigs');
        },
        enumerable: false,
        configurable: true
    });
    CaseFormComponent.prototype.add = function (label) {
        switch (label) {
            case 'fixUrls':
                this.fixUrls.push(this.fb.control(''));
                break;
        }
        return false;
    };
    CaseFormComponent.prototype["delete"] = function (label, index) {
        switch (label) {
            case 'fixUrls':
                this.fixUrls.removeAt(index);
                break;
        }
        return false;
    };
    CaseFormComponent.prototype.onFileChanged = function (event) {
        console.log(event.target.files);
        for (var i = 0; i < event.target.files.length; i++) {
            console.log(event.target.files[i]);
            this.files.push(event.target.files[i]);
        }
    };
    __decorate([
        core_1.Input()
    ], CaseFormComponent.prototype, "case");
    __decorate([
        core_1.Input()
    ], CaseFormComponent.prototype, "newOrEdit");
    __decorate([
        core_1.Input()
    ], CaseFormComponent.prototype, "id");
    CaseFormComponent = __decorate([
        core_1.Component({
            selector: 'app-case-form',
            templateUrl: './case-form.component.html',
            styleUrls: ['./case-form.component.css']
        })
    ], CaseFormComponent);
    return CaseFormComponent;
}());
exports.CaseFormComponent = CaseFormComponent;
function repoNameValidator(control) {
    if (!control.value.match(/^[^\s]+\/[^\s]+$/)) {
        return { invalidRepoName: true };
    }
}
function jobNumberValidator(control) {
    if (!control.value.match(/^\d+\.\d+$/)) {
        return { invalidJobNumber: true };
    }
}
function numberValidator(control) {
    if (control.value == null || !control.value.toString().match(/^\d+$/)) {
        return { invalidNumber: true };
    }
}
function shaValidator(control) {
    if (control.value == null || !control.value.match(/^\w+$/)) {
        return { invalidSha: true };
    }
}
