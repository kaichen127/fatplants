import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlmolComponent } from './glmol.component';

describe('GlmolComponent', () => {
  let component: GlmolComponent;
  let fixture: ComponentFixture<GlmolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlmolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlmolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
