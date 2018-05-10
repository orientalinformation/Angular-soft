import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempProfileEditorComponent } from './temp-profile-editor.component';

describe('TempProfileEditorComponent', () => {
  let component: TempProfileEditorComponent;
  let fixture: ComponentFixture<TempProfileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempProfileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempProfileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
