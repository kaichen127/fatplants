import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayViewerComponent } from './pathway-viewer.component';

describe('PathwayViewerComponent', () => {
  let component: PathwayViewerComponent;
  let fixture: ComponentFixture<PathwayViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
