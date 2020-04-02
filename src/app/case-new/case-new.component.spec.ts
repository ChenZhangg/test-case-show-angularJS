import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNewComponent } from './case-new.component';

describe('CaseNewComponent', () => {
  let component: CaseNewComponent;
  let fixture: ComponentFixture<CaseNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
