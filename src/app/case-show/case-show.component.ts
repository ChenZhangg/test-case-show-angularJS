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
  figPath: string[] = [];
  constructor(private route: ActivatedRoute,private service: CaseService, private http: HttpClient) { 
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit() {
    this.service.show(this.id).subscribe(
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
          multipleCrash: data['multipleCrash'],
          crashClusterNum: data['crashClusterNum'],
          figs: data['figs'],
          logURL: data['_links']['log'],
          testItemsURL: data['_links']['testItems'],
          changedFilesURL: data['_links']['changedFiles']
        });
        console.log(data['figs'])
        console.log(data['figs'][0])
        for(let i in data['figs']) {
          this.figPath.push(`http://localhost:8090/testCases/figs/${data['figs'][i]}`);
        }
      }
    );

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

}
