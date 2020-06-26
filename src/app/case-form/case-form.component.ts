import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms'
import { CaseService } from '../case.service'
import { Case } from '../case.model';
import {Router} from "@angular/router"

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
  files:File[]  =  [];
  constructor(private fb: FormBuilder, private service: CaseService, private router: Router) {
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(this.case){
      this.form.controls.repoName.setValue(this.case.repoName);
      this.form.controls.jobNumber.setValue(this.case.jobNumber);
      this.form.controls.description.setValue(this.case.description);
      this.form.controls.includeException.setValue(this.case.includeException);
      this.form.controls.includeAssertion.setValue(this.case.includeAssertion);
      this.form.controls.causeUrl.setValue(this.case.causeUrl);
      this.form.controls.preCommit.setValue(this.case.preCommit);
      this.form.controls.currentCommit.setValue(this.case.currentCommit);
      this.form.controls.multipleCrash.setValue(this.case.multipleCrash);
      this.form.controls.crashClusterNum.setValue(this.case.crashClusterNum);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      repoName: ['', Validators.required],
      jobNumber: ['', Validators.required],
      description: [''],
      includeException: [false],
      includeAssertion: [false],
      causeUrl: [''],
      preCommit: [''],
      currentCommit: [''],
      multipleCrash: [false],
      crashClusterNum: ['', Validators.required],
      fixUrls: this.fb.array([this.fb.control('')]),
      figs:  ['']
    });
    this.form.controls.causeUrl.valueChanges.subscribe(
      (value: string) => {
        let pattern:RegExp = /compare\/(\S+)\.\.\.(\S*)/
        let result: string[] = pattern.exec(value);
        if(result && result[1]){
          this.form.controls.preCommit.setValue(result[1]);
          this.form.controls.currentCommit.setValue(result[2]);
        }
      }
    );
  }

  onSubmit(): void { 
    console.log('you submitted value:', this.form.value);
    const formData =  new  FormData();
    for  (var i =  0; i <  this.files.length; i++)  {  
        formData.append("files",  this.files[i]);
    } 
    let f = this.form.value;
    formData.append("repoName", f.repoName);
    formData.append("jobNumber", f.jobNumber);
    formData.append("description", f.description);
    formData.append("includeException", f.includeException);
    formData.append("includeAssertion", f.includeAssertion);
    formData.append("causeUrl", f.causeUrl);
    formData.append("preCommit", f.preCommit);
    formData.append("currentCommit", f.currentCommit);
    formData.append("fixUrls", f.fixUrls);
    formData.append("multipleCrash", f.multipleCrash);
    formData.append("crashClusterNum", f.crashClusterNum);
    formData.append("data", f);
    console.log(this.newOrEdit);
    if (this.newOrEdit) {
      this.service.new(formData);
    } else {
      this.service.update(this.form.value, this.id)
    }
    this.router.navigate(['testCases'])

  }

  
  get fixUrls() {
    return this.form.get('fixUrls') as FormArray;
  }

  get figs() {
    return this.form.get('logFigs') as FormArray;
  }

  add(label: String) {
    switch(label) {
      case "fixUrls":
        this.fixUrls.push(this.fb.control(''));
        break;
    }
    
    return false;
  }

  delete(label: String, index: number) {
    switch(label) {
      case "fixUrls":
        this.fixUrls.removeAt(index);
        break;

    }
    return false;
  }

  onFileChanged(event) {
    console.log(event.target.files);
    for  (var i =  0; i <  event.target.files.length; i++)  {  
      console.log(event.target.files[i]);
      this.files.push(event.target.files[i]);
    }
  }

}
