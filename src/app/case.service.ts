import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Case } from './case.model'

@Injectable()
export class CaseService {

  constructor(private http: HttpClient) {}

  index(): Case[] {
    var cases: Case[] = new Array<Case>();
    this.http.get('http://localhost:8080/testCases').subscribe(
      data => {
        for (var i = 0; i <data['_embedded']['testCases'].length; i ++) {
          var tmp = data['_embedded']['testCases'][i]
          var c: Case = new Case({
            id: tmp['id'],
            repoName: tmp['repoName'],
            jobNumber: tmp['jobNumber'],
            description: tmp['description'],
            includeException: tmp['includeException'],
            includeAssertion: tmp['includeAssertion'],
            num: tmp['number'],
            causeUrl: tmp['causeUrl'],
            preCommit: tmp['preCommit'],
            currentCommit: tmp['currentCommit']
          });
          cases.push(c);
        }
      }
    );
    return cases;
  }

  new(form: any): void {
    this.http.post(
      'http://localhost:8080/testCases', 
      JSON.stringify({repoName: form.repoName, 
        jobNumber: form.jobNumber,
        description: form.description,
        includeException: form.includeException,
        includeAssertion: form.includeAssertion,
        causeUrl: form.causeUrl,
        preCommit: form.preCommit,
        currentCommit: form.currentCommit,
        fixUrls: form.fixUrls,
      }), 
      {headers: new HttpHeaders().set('Content-type', 'application/json')}).subscribe();
  }

  edit(id: number): any {
    return this.http.get(`http://localhost:8080/testCases/${id}`);
  }

  update(form: any, id: number): void {
    this.http.patch(
      `http://localhost:8080/testCases/${id}`, 
      JSON.stringify({
        // repoName: form.repoName, 
        // jobNumber: form.jobNumber,
        // description: form.description,
        // includeException: form.includeException,
        // includeAssertion: form.includeAssertion,
        causeUrl: form.causeUrl,
        preCommit: form.preCommit,
        currentCommit: form.currentCommit,
        // fixUrls: form.fixUrls,
      }), 
      {headers: new HttpHeaders().set('Content-type', 'application/json')}).subscribe();
  }

  show(id: number): Case {
    let c: Case = null; 
    this.http.get(`http://localhost:8080/testCases/${id}`).subscribe(
      data => {
        console.log(data);
        c = new Case({
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
          logURL: data['_links']['log'],
          testItemsURL: data['_links']['testItems'],
          changedFilesURL: data['_links']['changedFiles']
        });
      }
    );
    return c;
  }
}
