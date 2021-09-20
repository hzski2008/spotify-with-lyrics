import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeToolbarComponent } from './home-toolbar.component';
import { AuthService } from 'app/shared/auth.service';
import { DefaultPipe } from 'app/home/shared/default.pipe';
import { MatMenuModule } from '@angular/material/menu';

describe('HomeToolbarComponent', () => {
  let component: HomeToolbarComponent;
  let fixture: ComponentFixture<HomeToolbarComponent>;
  const authServiceStub = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    login: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeToolbarComponent, DefaultPipe],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
      imports: [ MatMenuModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
