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

  // 图片名后缀 RepoName JobId
  @Input() postfix: string;
  @Output() postfixChange = new EventEmitter();
  RepoName: string;
  JobId: string;
  // 图片后缀下拉框
  lists = ['', 'testsinerror',
           'stack', 'failedstack',
           'cause', 'failedcause',
           'fix', 'failedfix',
           'testcases', 'other'];
  currentFileName: string; // 用来显示 当前文件名

  files: File[] = [];
  editFormData: FormData = new FormData();
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
      if (this.case.includeException == true) {
        this.form.controls.includeException.setValue(this.case.includeException);
      }
      if (this.case.includeAssertion == true) {
        this.form.controls.includeAssertion.setValue(this.case.includeAssertion);
      }
      this.form.controls.causeUrl.setValue(this.case.causeUrl);
      this.form.controls.preCommit.setValue(this.case.preCommit);
      this.form.controls.currentCommit.setValue(this.case.currentCommit);
      if (this.case.multipleCrash == true) {
        this.form.controls.multipleCrash.setValue(this.case.multipleCrash);
      }
      this.form.controls.crashClusterNum.setValue(this.case.crashClusterNum);

      if (this.case.multipleAssertion == true) {
        this.form.controls.multipleAssertion.setValue(this.case.multipleAssertion);
      }
      this.form.controls.assertionClusterNum.setValue(this.case.assertionClusterNum);

      if (this.case.multipleError == true) {
        this.form.controls.multipleError.setValue(this.case.multipleError);
      }
      this.form.controls.clusterNum.setValue(this.case.clusterNum);
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
      figs: ['']
    });

    for (const ctrl in this.form.controls) {
      if (ctrl == 'causeUrl') {
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
            // console.log("====" + ctrl.constructor.name + ctrl);
            // console.log(value);

          });
      }
    }
  }

  onSubmit(): void {
    console.log('you submitted value:', this.form.value);

    const formData =  new FormData();
    for (let i = 0; i <  this.files.length; i++)  {
        formData.append('files',  this.files[i]);
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

  onFileChanged(event) {
    // console.log(event.target.files);
    for (let i =  0; i <  event.target.files.length; i++) {
      if (this.currentFileName != '' && this.currentFileName != null) {
        let tmp = new File([event.target.files[i]], this.currentFileName);
        this.files.push(tmp);
      } else {
        this.files.push(event.target.files[i]);
      }
      // let figname = this.currentFileName == '' ?  event.target.files[i].name : this.currentFileName;
      // this.files.push(event.target.files[i]);
    }
  }

  /**
   * 获得下拉框的内容
   * @param post
   */
  getPostfix(post: string) {

    const f = this.form.value;
    this.RepoName = f.repoName;
    this.JobId = f.jobNumber;
    let tmp = '';
    if ((this.RepoName != '') && (this.JobId != '')) { // 如果有输入的话
      tmp = this.RepoName + '_' + this.JobId;
    } else {
      tmp = 'tmp';
    }

    tmp = tmp.replace('/', '_');
    tmp = tmp + '_' + post;

    this.currentFileName = tmp + '.png';
    console.log('ccccc:' + this.currentFileName);
    // this.RepoName = tmp;
    // console.log('rrrreponame+'+ this.RepoName);
    // this.currentFileName = this.RepoName+ this.JobId+
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
