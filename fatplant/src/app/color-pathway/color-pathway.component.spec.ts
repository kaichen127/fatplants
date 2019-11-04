import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPathwayComponent } from './color-pathway.component';

describe('ColorPathwayComponent', () => {
  let component: ColorPathwayComponent;
  let fixture: ComponentFixture<ColorPathwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorPathwayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPathwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
