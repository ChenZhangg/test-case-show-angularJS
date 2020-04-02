import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseShowComponent } from './case-show.component';

describe('CaseShowComponent', () => {
  let component: CaseShowComponent;
  let fixture: ComponentFixture<CaseShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
