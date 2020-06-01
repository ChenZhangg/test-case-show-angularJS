import { Component, OnInit, Input } from '@angular/core';
import { Case } from '../case.model'
import { CaseService } from '../case.service';

@Component({
  selector: 'app-case-item',
  templateUrl: './case-item.component.html',
  styleUrls: ['./case-item.component.css']
})
export class CaseItemComponent implements OnInit {
  @Input() case: Case;

  constructor(private service: CaseService) { 
  }

  ngOnInit(): void {
  }

  deleteCase(id: number): boolean {
    this.service.delete(id);
    return true;
  }
}
