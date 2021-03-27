import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPathwayListComponent } from './custom-pathway-list.component';

describe('CustomPathwayListComponent', () => {
  let component: CustomPathwayListComponent;
  let fixture: ComponentFixture<CustomPathwayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomPathwayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomPathwayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
