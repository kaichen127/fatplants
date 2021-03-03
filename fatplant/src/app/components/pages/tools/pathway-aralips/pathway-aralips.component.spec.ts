import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayAralipsComponent } from './pathway-aralips.component';

describe('PathwayAralipsComponent', () => {
  let component: PathwayAralipsComponent;
  let fixture: ComponentFixture<PathwayAralipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayAralipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayAralipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
