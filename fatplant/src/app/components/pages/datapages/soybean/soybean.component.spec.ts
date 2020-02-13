import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoybeanComponent } from './soybean.component';

describe('SoybeanComponent', () => {
  let component: SoybeanComponent;
  let fixture: ComponentFixture<SoybeanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoybeanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoybeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
