import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewchainingComponent } from './newchaining.component';

describe('NewchainingComponent', () => {
  let component: NewchainingComponent;
  let fixture: ComponentFixture<NewchainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewchainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewchainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
