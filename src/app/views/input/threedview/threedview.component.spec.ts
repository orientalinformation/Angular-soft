import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreedviewComponent } from './threedview.component';

describe('ThreedviewComponent', () => {
  let component: ThreedviewComponent;
  let fixture: ComponentFixture<ThreedviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreedviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreedviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
