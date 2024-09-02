import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FallingLetterComponent } from './falling-letter.component';

describe('FallingLetterComponent', () => {
  let component: FallingLetterComponent;
  let fixture: ComponentFixture<FallingLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FallingLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FallingLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
