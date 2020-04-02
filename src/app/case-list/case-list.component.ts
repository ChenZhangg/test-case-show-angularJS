import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Case } from '../case.model'
import { CaseService } from '../case.service'

@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})
export class CaseListComponent implements OnInit {
  data: object;
  cases: Case[];
  repo_names: string[];
  constructor(private http: HttpClient, private service: CaseService) { 
    //this.cases = new Array<Case>();
  }

  ngOnInit(): void {
    /*
    this.http.get('http://localhost:8080/testCases').subscribe(
      data => {
        this.data = data;
        for (var i = 0; i <data['_embedded']['testCases'].length; i ++) {
          var tmp = data['_embedded']['testCases'][i]
          var c: Case = new Case({
            repoName: tmp['repoName'],
            jobNumber: tmp['jobNumber'],
            description: tmp['description'],
            includeException: tmp['includeException'],
            includeAssertion: tmp['includeAssertion'],
            num: tmp['number']
          });
          // console.log(c);
          this.cases.push(c);
        }
      }
    );
    */
   this.cases = this.service.index();
  }

}
