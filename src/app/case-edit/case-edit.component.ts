import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseService } from '../case.service';
import { Case } from '../case.model';

@Component({
  selector: 'app-case-edit',
  templateUrl: './case-edit.component.html',
  styleUrls: ['./case-edit.component.css']
})
export class CaseEditComponent implements OnInit {

  id: number;
  case: Case;
  constructor(private route: ActivatedRoute, private service: CaseService) { 
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit(): void {
    this.service.edit(this.id).subscribe(
      data => {
        console.log(data);
        console.log(data['repoName']);
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

          multipleAssertion: data['multipleAssertion'],
          assertionClusterNum: data['assertionClusterNum'],
          multipleError: data['multipleError'],
          clusterNum: data['clusterNum']
        });
      }
    );
  }
}
