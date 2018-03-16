import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPdfviewerComponent } from './report-pdfviewer.component';

describe('ReportPdfviewerComponent', () => {
  let component: ReportPdfviewerComponent;
  let fixture: ComponentFixture<ReportPdfviewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPdfviewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPdfviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
