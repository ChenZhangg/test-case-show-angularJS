import { Component, OnInit, OnChanges, Input, Inject} from '@angular/core';
import { CaseService } from '../case.service';
import { ActivatedRoute } from '@angular/router';
import { Case, TestItem, ChangedFile, ChangedMethod } from '../case.model';
import { HttpClient } from '@angular/common/http';
import { fileURLToPath } from 'url';

@Component({
  selector: 'app-case-show',
  templateUrl: './case-show.component.html',
  styleUrls: ['./case-show.component.css']

})
export class CaseShowComponent implements OnInit, OnChanges {
  id: number;
  case: Case;
  figPath: string[] = [];

  constructor(private route: ActivatedRoute,
              private service: CaseService,
              private http: HttpClient,
              @Inject('MY_URL') private MyUrl: string) {
    route.params.subscribe(params => { this.id = params['id']; });
  }

  ngOnInit() {
    this.service.show(this.id).subscribe(
      data => {
        console.log(data);

        this.Sort(data['figs']);

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
          changedFilesURL: data['_links']['changedFiles'],

          multipleAssertion: data['multipleAssertion'],
          assertionClusterNum: data['assertionClusterNum'],
          multipleError: data['multipleError'],
          clusterNum: data['clusterNum']
        });

        for (let i in data['figs']) {
         this.figPath.push(`${this.MyUrl}/figs/${data['figs'][i]}`);
        }

      }
    );
  }

  /*
  * 图片数组进行排序
  * @param: 文件路径 是个string数组
  * @return: void
  * */
  Sort(figpath: string[] ): void {
    let length = figpath.length;
    let temp = new Map();
    for ( let i = 0 ; i < length ; i ++ ) {
      let str = figpath[i];
      let val = 10; // 权值用于排序
      if (str.match('stack') != null) {
        val = 1;
      } else if (str.match('error')) {
        val = 1;
      } else if (str.match('tests') != null) {
        val = 2;
      } else if (str.match('cause') != null) {
        val = 3;
      } else if (str.match('fix') != null) {
        val = 4;
      } else if (str.match('case') != null) {
        val = 5;
      } else {
        // 还是val = 10
      }
      temp.set(str, val);
    }
    // 已经全部都添加到map里面了，然后接下去开始排序
    let arr = Array.from(temp);
    arr.sort((a, b): number => a[1] - b[1]);
    for (let i = 0; i < arr.length; i++) {
      figpath[i] = arr[i][0];
    }
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    console.log(changes);
    if (this.case) {
      this.http.get(this.case.logURL).subscribe(
        data => {
          console.log(data);
        }
      );
    }
  }

  /*
  * 删除图片
  * @param:当前图片的路径
  * @retrun:
  * */
  deletePicture(filename: string): void {
    this.service.deleteFigure(this.case.id, filename);
  }
}
