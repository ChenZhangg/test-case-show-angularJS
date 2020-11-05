import {Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { CaseService } from '../case.service';
import { Case } from '../case.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-form',
  templateUrl: './case-form.component.html',
  styleUrls: ['./case-form.component.css']
})


export class CaseFormComponent implements OnInit, OnChanges {
  @Input() case: Case;
  @Input() newOrEdit: boolean;
  @Input() id: number;

  form: FormGroup;
  // 图片后缀下拉框
  lists = ['log',
           'stacktrace',
           'cause',
           'fix',
           'code'];
  suffix: string;
  files: File[] = [];
  saveFigNames: string[] = [];
  constructor(private fb: FormBuilder,
              private service: CaseService,
              private router: Router) {
  }
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if (this.case) {
      this.form.controls.id.setValue(this.case.id);
      this.form.controls.repoName.setValue(this.case.repoName);
      this.form.controls.jobNumber.setValue(this.case.jobNumber);
      this.form.controls.description.setValue(this.case.description);
      if (this.case.includeException === true) {
        this.form.controls.includeException.setValue(this.case.includeException);
      }
      if (this.case.includeAssertion === true) {
        this.form.controls.includeAssertion.setValue(this.case.includeAssertion);
      }
      this.form.controls.causeUrl.setValue(this.case.causeUrl);
      this.form.controls.preCommit.setValue(this.case.preCommit);
      this.form.controls.currentCommit.setValue(this.case.currentCommit);
      if (this.case.multipleCrash === true) {
        this.form.controls.multipleCrash.setValue(this.case.multipleCrash);
      }
      this.form.controls.crashClusterNum.setValue(this.case.crashClusterNum);

      if (this.case.multipleAssertion === true) {
        this.form.controls.multipleAssertion.setValue(this.case.multipleAssertion);
      }
      this.form.controls.assertionClusterNum.setValue(this.case.assertionClusterNum);

      if (this.case.multipleError === true) {
        this.form.controls.multipleError.setValue(this.case.multipleError);
      }
      this.form.controls.clusterNum.setValue(this.case.clusterNum);
      this.saveFigNames = this.case.figs;
      console.log('已经保存的图片名' + this.saveFigNames);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [''],
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
      figs: [],

      suffix: [null] // 下拉列表框
    });

    for (const ctrl in this.form.controls) {
      if (ctrl === 'causeUrl') {
        this.form.get(ctrl).valueChanges.subscribe(
          (value: string) => {
            const pattern: RegExp = /compare\/(\S+)\.\.\.(\S*)/;
            const result: string[] = pattern.exec(value);
            if (result && result[1]) {
              this.form.controls.preCommit.setValue(result[1]);
              this.form.controls.currentCommit.setValue(result[2]);
            }
          });
      } else {
        this.form.get(ctrl).valueChanges.subscribe(
          (value: string) => {
            // console.log("====" + ctrl.constructor.name + ctrl); xnZBM
            // console.log(value);

          });
      }
    }
  }

  onSubmit(): void {
    console.log('you submitted value:', this.form.value);

    const formData =  new FormData();
    for (const file of  this.files)  {
        formData.append('files',  file);
    }
    const f = this.form.value;
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
      this.service.new(formData);

    } else {
      this.service.update(formData, this.id);
    }
    setTimeout(() => { this.router.navigate(['testCases']); }, 2000);
    }

  get fixUrls() {
    return this.form.get('fixUrls') as FormArray;
  }

  get figs() {
    return this.form.get('logFigs') as FormArray;
  }

  add(label: string) {
    switch (label) {
      case 'fixUrls':
        this.fixUrls.push(this.fb.control(''));
        break;
    }
    return false;
  }

  delete(label: string, index: number) {
    switch (label) {
      case 'fixUrls':
        this.fixUrls.removeAt(index);
        break;
    }
    return false;
  }

  getMaxIndex(): number {
    const f = this.form.value;
    const suffix: string = f.suffix;
    let index = -1;
    for (const savedFigName of this.saveFigNames) {
      const regex: RegExp = new RegExp(suffix + '_' + '(\\d+)');
      const match = regex.exec(savedFigName);
      console.log('Match-> ' + match);
      if (match !== null) {
        index = parseInt(match[1], 10);
      }
    }
    console.log('Max Index: ' + index);
    return index;
  }

  onFileChanged(event) {
    const f = this.form.value;
    console.log(f);

    if (f.suffix === null) {
      window.alert('请选择suffix');
      f.figs = [];
      return;
    }
    for (const tmpFile of event.target.files) {
      const index: number = this.getMaxIndex() + 1;
      let fileName: string = f.repoName + '_' + f.jobNumber + '_' + f.suffix + '_' + index + '.png';
      fileName = fileName.replace('/', '@');
      console.log(tmpFile.name, ' 图片名称变为-> ', fileName);
      const file: File = new File([tmpFile], fileName);
      this.files.push(file);
      this.saveFigNames.push(fileName);
    }
  }

  /**
   * 根据下拉框的内容，设置图片后缀名
   */
  setFigType(suffix: string) {
    const f = this.form.value;
    console.log(f);
    if (f.repoName === '' || f.jobNumber === '') {
      window.alert('请添加Repo Name和Job Number');
    }
    this.suffix = suffix;
  }

}

function repoNameValidator(control: FormControl): {[s: string]: boolean} {
  if (!control.value.match(/^[^\s]+\/[^\s]+$/)) {
    return {invalidRepoName: true};
  }
}

function jobNumberValidator(control: FormControl): {[s: string]: boolean} {
  if (!control.value.match(/^\d+\.\d+$/)) {
    return {invalidJobNumber: true};
  }
}

function numberValidator(control: FormControl): {[s: string]: boolean} {
  if (control.value == null || !control.value.toString().match(/^\d+$/)) {
    return {invalidNumber: true};
  }
}

function shaValidator(control: FormControl): {[s: string]: boolean} {
  if (control.value == null || !control.value.match(/^\w+$/)) {
    return {invalidSha: true};
  }
}
