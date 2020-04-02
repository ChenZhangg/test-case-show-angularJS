import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { CaseService } from '../case.service'
import { Case } from '../case.model';
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
  constructor(private fb: FormBuilder, private service: CaseService) {
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
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      repoName: [''],
      jobNumber: [''],
      description: [''],
      includeException: [false],
      includeAssertion: [false],
      causeUrl: [''],
      preCommit: [''],
      currentCommit: [''],
      fixUrls: this.fb.array([this.fb.control('')]),
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
    if (this.newOrEdit) {
      this.service.new(this.form.value);
    } else {
      this.service.update(this.form.value, this.id)
    }
  }

  
  get fixUrls() {
    return this.form.get('fixUrls') as FormArray;
  }

  addFixUrl() {
    this.fixUrls.push(this.fb.control(''));
    return false;
  }

  deleteFixUrl(index: number) {
    this.fixUrls.removeAt(index);
    return false;
  }
}
