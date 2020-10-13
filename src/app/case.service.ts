import { Injectable, Inject } from '@angular/core';

import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Case } from './case.model';
import { Observable } from 'rxjs';
import * as $ from 'jquery';

@Injectable()
export class CaseService {

  constructor(private http: HttpClient,
              @Inject('REST_URL') private RestUrl: string, // rest处理
              @Inject('MY_URL') private MyUrl: string) {// 自己处理
  }

  index(): Case[] {
    let cases: Case[] = new Array<Case>();
    this.http.get(this.RestUrl).subscribe(
      data => {
        for (let i = 0; i < data['_embedded']['testCases'].length; i ++) {
          let tmp = data['_embedded']['testCases'][i];
          let c: Case = new Case({
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

  /*
  * 创建新的案例 使用自己的controller处理请求
  * @param:
  * @return: NULL
  * */
  new(data: any): void {
    this.http.post(
      // 'http://10.176.34.86:8090/testCases/', data,
      // `http://localhost:8090/testCases/`, data,
      // 开发环境
      // `${this.apiUrlD}`, data,
      // 生产环境
      `${this.MyUrl}`, data,
      {
        headers:
          new HttpHeaders().set('Access-Control-Allow-Origin', '*')
      }).subscribe();

  }

  /*
  * 编辑案例
  * @param:id
  * @return:
  * */
  edit(id: number): any {
    return this.http.get(
      `${this.RestUrl}/${id}`,
      {
        headers:
          new HttpHeaders().set('Access-Control-Allow-Origin', '*')
      });
  }

  /*
  * edit
  *
  * */
  update(data: any, id: number): void {
    console.log(id);
    this.http.patch(
      // `http://10.176.34.86:8090/testCases/${id}`, data,
      `${this.MyUrl}/${id}`, data,
      {
        headers:
          new HttpHeaders().set('Access-Control-Allow-Origin', '*')
      })
      .subscribe();
  }

  /*
  * 获取所有的案例
  * @param:
  * @return:
  * */
  show(id: number) {
    return this.http.get(`${this.RestUrl}/${id}`);
  }

  /*
  * TBD
  * @param:文件名
  * @return:
  * */
  // tslint:disable-next-line:ban-types
  getFig(fileName: String) {
    return this.http.get(`${this.RestUrl}/figs/${fileName}`);
  }

  /*
  * TBD
  * @param:
  * @return:
  * */
  delete(id: number): void {
    console.log(id);
    console.log(`${this.RestUrl}/${id}`);
    this.http.delete(`${this.RestUrl}/${id}`).subscribe(
    );
  }

  /*
  * 删除截图
  * @param: 文件名 string
  * @return:
  * */
  // @ts-ignore
  deleteFigure(id: number, filepath: string): void {
    console.log('到deletefigure 这里了！', filepath);
    this.http.delete(`${this.MyUrl}?id=${id}&filepath=${filepath}`).subscribe(
      data => {
        console.log(data);
      });
  }


}
