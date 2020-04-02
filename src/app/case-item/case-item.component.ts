import { Component, OnInit, Input } from '@angular/core';
import { Case } from '../case.model'

@Component({
  selector: 'app-case-item',
  templateUrl: './case-item.component.html',
  styleUrls: ['./case-item.component.css']
})
export class CaseItemComponent implements OnInit {
  @Input() case: Case;

  constructor() { 
  }

  ngOnInit(): void {
  }

}
