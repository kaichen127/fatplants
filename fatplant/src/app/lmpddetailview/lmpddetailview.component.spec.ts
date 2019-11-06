import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmpddetailviewComponent } from './lmpddetailview.component';

describe('LmpddetailviewComponent', () => {
  let component: LmpddetailviewComponent;
  let fixture: ComponentFixture<LmpddetailviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmpddetailviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmpddetailviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
