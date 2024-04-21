import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessItemComponent } from './guess-item.component';

describe('GuessItemComponent', () => {
  let component: GuessItemComponent;
  let fixture: ComponentFixture<GuessItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GuessItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
