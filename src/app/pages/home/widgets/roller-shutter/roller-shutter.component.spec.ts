import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RollerShutterComponent } from './roller-shutter.component';

describe('RollerShutterComponent', () => {
  let component: RollerShutterComponent;
  let fixture: ComponentFixture<RollerShutterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RollerShutterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RollerShutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
