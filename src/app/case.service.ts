import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Case } from './case.model'
import { Observable } from 'rxjs';

@Injectable()
export class CaseService {

  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) {}

  index(): Case[] {
    var cases: Case[] = new Array<Case>();
    this.http.get(this.apiUrl).subscribe(
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

/*   new(form: any): void {
    this.http.post(
      this.apiUrl, 
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
  } */

  new(data: any): void {
    this.http.post(
      "http://10.176.34.86:8090/testCases", 
      data,
      {headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')}).subscribe();
  }

  edit(id: number): any {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(data: any, id: number): void {
    console.log(id);
    this.http.patch(
      `http://10.176.34.86:8090/testCases/${id}`, 
      data, 
      {headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*')}).subscribe();
  }

  show(id: number) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getFig(fileName: String) {
    return this.http.get(`${this.apiUrl}/figs/${fileName}`);
  }

  delete(id: number) {
    console.log(id);
    console.log(`${this.apiUrl}/${id}`);
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(

    );
  }
}
