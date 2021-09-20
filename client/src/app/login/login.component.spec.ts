import { AuthService } from 'app/shared/auth.service';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '@syncfusion/ej2-angular-popups';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userEl: HTMLElement;
  let passwordEl: HTMLElement;
  let signInEl: HTMLElement;
  let authServiceStub;
  let spotifyLoginEl: DebugElement;
  let authService: AuthService;

  beforeEach(async(() => {
    authServiceStub = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      login: () => {},
    };

    TestBed.configureTestingModule({
      imports: [FormsModule, MatDialogModule, MatIconModule, DialogModule],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    userEl = fixture.nativeElement.querySelector('input[name=userName]');
    passwordEl = fixture.nativeElement.querySelector('input[type=password]');
    signInEl = fixture.nativeElement.querySelector('#SignIn');
    spotifyLoginEl = fixture.debugElement.query(By.css('#SSOSignIn'));
    authService = TestBed.get(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Clicking on SignIn button should invoke authenticate method with form data', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    fixture.detectChanges(); // trigger ngOnInit here
    tick();
    expect((signInEl as any).disabled).toBeFalsy();

    (userEl as any).value = 'john';
    userEl.dispatchEvent(new Event('input'));
    (passwordEl as any).value = 'demo';
    passwordEl.dispatchEvent(new Event('input'));
    tick();

    signInEl.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it("should call AuthService's login() when SSO login button is clicked", () => {
    spyOn(authService, 'login');

    expect(spotifyLoginEl.nativeElement).toBeTruthy(); // spotify login button is displayed
    spotifyLoginEl.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(authService.login).toHaveBeenCalled();
  });
});
