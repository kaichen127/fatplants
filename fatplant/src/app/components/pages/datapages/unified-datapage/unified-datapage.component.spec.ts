import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedDatapageComponent } from './unified-datapage.component';

describe('UnifiedDatapageComponent', () => {
  let component: UnifiedDatapageComponent;
  let fixture: ComponentFixture<UnifiedDatapageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnifiedDatapageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnifiedDatapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
