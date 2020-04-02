import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { CaseService } from '../case.service';
import { ActivatedRoute } from '@angular/router';
import { Case, TestItem, ChangedFile, ChangedMethod } from '../case.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-case-show',
  templateUrl: './case-show.component.html',
  styleUrls: ['./case-show.component.css']
})
export class CaseShowComponent implements OnInit, OnChanges {
  id: number;
  case: Case;
  testItems: TestItem[];
  changedFiles: ChangedFile[]
  constructor(private route: ActivatedRoute,private service: CaseService, private http: HttpClient) { 
    route.params.subscribe(params => { this.id = params['id']; });
    this.testItems = new Array<TestItem>();
    this.changedFiles = new Array<ChangedFile>();
  }
  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log(changes);
    if(this.case){
      this.http.get(this.case.logURL).subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  ngOnInit(): void {
    this.http.get(`http://localhost:8080/testCases/${this.id}`).subscribe(
      data => {
        console.log(data);
        this.case = new Case({
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
          logURL: data['_links']['testLog']['href'],
          testItemsURL: data['_links']['testItems']['href'],
          changedFilesURL: data['_links']['changedFiles']['href']
        });

        this.http.get(this.case.logURL).subscribe(
          data => {
            console.log(data);
            this.case.log = data['log'];
          }
        );

        this.http.get(this.case.testItemsURL).subscribe(
          data => {
            console.log(data);
            for (var i = 0; i <data['_embedded']['testItems'].length; i ++) {
              var tmp = data['_embedded']['testItems'][i]
              var c: TestItem = new TestItem({
                className: tmp['className'],
                methodName: tmp['methodName'],
                errorMessage: tmp['errorMessage'],
                stackTrace: tmp['stackTrace'],
              });
              this.testItems.push(c);
            }
          }
        );

        this.http.get(this.case.changedFilesURL).subscribe(
          data => {
            console.log(data);
            for (var i = 0; i <data['_embedded']['changedFiles'].length; i ++) {
              var tmp = data['_embedded']['changedFiles'][i]
              var c: ChangedFile = new ChangedFile({
                status: tmp['status'],
                preFilePath: tmp['preFilePath'],
                currentFilePath: tmp['currentFilePath'],
                changedMethodsURL: tmp['_links']['changedMethods']['href'],
              });
              this.changedFiles.push(c);
            }
            for( let c of this.changedFiles) {
              this.http.get(c.changedMethodsURL).subscribe(
                data => {
                  console.log(data);
                  for (var i = 0; i <data['_embedded']['changedMethods'].length; i ++) {
                    var tmp = data['_embedded']['changedMethods'][i]
                    var cc: ChangedMethod = new ChangedMethod({
                      className: tmp['className'],
                      methodName: tmp['methodName'],
                      startLineNumber: tmp['startLineNumber'],
                      endLineNumber: tmp['endLineNumber'],
                    });
                    c.changedMethods.push(cc);
                  }
                }
              );
            }
          }
        );




      }
    );
  }

}
