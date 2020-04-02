import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseItemComponent } from './case-item.component';

describe('CaseItemComponent', () => {
  let component: CaseItemComponent;
  let fixture: ComponentFixture<CaseItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
