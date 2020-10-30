import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Component, ViewChild, TemplateRef, OnInit, OnChanges, Input, Inject, ElementRef} from '@angular/core';
import { CaseService } from '../case.service';
import { ActivatedRoute } from '@angular/router';
import { Case, TestItem, ChangedFile, ChangedMethod } from '../case.model';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { fileURLToPath } from 'url';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { ModalModule } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-case-show',
  templateUrl: './case-show.component.html',
  styleUrls: ['./case-show.component.css']

})
export class CaseShowComponent implements OnInit, OnChanges {
  id: number;
  case: Case;
  figPath: string[] = [];
  tempfigpath: string; // 修改图片名称和删除图片的时候用到
  newfigpath: string;
  processfigpath: string; // 需要用正则表达式处理的图片路径显示旧的图片名称
  form: FormGroup;
  modalRef: BsModalRef;
  changeFigNamemessage: boolean; // 表示修改图片名称成功与否 true 表示成功。
  deleteFigmessage: boolean ;
  deleteOrchange: number; // 表示是按了删除还是修改按钮  其中 0表示删除，1表示修改
  @ViewChild('deleteFig')
  deleteModal: TemplateRef<any>;
  @ViewChild('check')
  check: TemplateRef<any>;

  constructor(private route: ActivatedRoute,
              private service: CaseService,
              private http: HttpClient,
              @Inject('MY_URL') private MyUrl: string,
              private modalService: BsModalService,
              private fb: FormBuilder,
              private router: Router) {
    this.changeFigNamemessage = false;
    this.deleteFigmessage = false;
    route.params.subscribe(params => { this.id = params['id']; });
    /**
     * newfigpath 是重新输入图片路径的文本框 需要验证 不为空&字符串格式两项格式
     */
    this.form = new FormGroup(
      {
        newfigpath: new FormControl('',
      [
        Validators.required,
        Validators.pattern('^[\-0-9a-zA-Z]+_[\-0-9a-zA-Z]+_([1-9][0-9]*)+(\.[0-9]{1,2})?_[a-zA-Z]+$'),
      ]),
   });
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
          // 如果图片是空的，那就不要加到显示里面去。
          if (data['figs'][i] != '') {
            this.figPath.push(`${this.MyUrl}/figs/${data['figs'][i]}`);
          }
        }

      }
    );
  }

  /**
   * 图片数组进行排序
   * @param: 文件路径 是个string数组
   * @return: void
   */
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

  /**
   * 删除图片
   * @param filename
   * @return void
   */
  deletePicture(): void {
    this.service.deleteFigure(this.case.id, this.tempfigpath).subscribe(
      judge => {
        if (judge) {
          this.deleteFigmessage = true;
        }
        this.deleteOrchange = 1;
        this.openCheck();
      }
    );
    this.modalRef.hide();
  }

  /**
   * 打开修改名称窗口
   * @param: template
   * @param 输入图片路径 string
   * @return :void
   */
  openChangeNameModal(template: TemplateRef<any>, figpath: string) {
    this.modalRef = this.modalService.show(template);

    this.processfigpath = this.changePathtoName(figpath);
    this.form.controls.newfigpath.setValue(this.processfigpath);

    this.tempfigpath = figpath; // 旧的figpath
  }

  /**
   * 处理图片路径 变成图片名称
   * @param template
   * @param figpath
   */
  changePathtoName(figpath: string): string {
    let temp = figpath.match('figs/[a-zA-Z0-9\\-._]+');
    let str = temp[0].replace('figs/', '');
    return str;
  }

  openDeleteModal(template: TemplateRef<any>, figpath: string) {
    this.tempfigpath = figpath;
    this.modalRef = this.modalService.show(template);
  }

  /**
   * 打开删除图片确认信息窗口
   */
  openCheck() {
    this.modalRef = this.modalService.show(this.check);
  }

  /**
   * 输入图片名界面确认
   * 现在才发送请求去修改名称
   */
  confirmChangeName(): void {
    this.modalRef.hide();

    console.log(this.form.controls.newfigpath.value);
    const data =  new FormData();
    data.append('figpath', this.tempfigpath);
    data.append('newfigname', this.form.controls.newfigpath.value);
    this.http.patch(
      `${this.MyUrl}/changeName/${this.id}`,
      data,
      {
        headers:
          new HttpHeaders().set('Access-Control-Allow-Origin', '*')
      }
    ).subscribe(
      check => {
        if (check) {
          this.changeFigNamemessage = true;
        }
        // 调出框来
        this.deleteOrchange = 2;
        this.openCheck();
      }
    );
  }

  /**
   * 界面取消等操作
   */
  decline(): void {
    this.modalRef.hide();

    // 如果成功就刷新当前页面。
    if (this.changeFigNamemessage || this.deleteFigmessage) {
      window.location.reload();
      // this.destination.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    }
  }

}



