import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFbComponent } from './login-fb.component';

describe('LoginFbComponent', () => {
  let component: LoginFbComponent;
  let fixture: ComponentFixture<LoginFbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
