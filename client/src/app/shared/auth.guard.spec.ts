// import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

class MockRouter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  navigate(path: any) {}
}

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: AuthService;
  let router: any;

  beforeEach(() => {
    router = new MockRouter();
    authService = new AuthService(router);
    authGuard = new AuthGuard(authService, router);
  });

  afterEach(() => {
    authService = {} as AuthService;
    authGuard = {} as AuthGuard;
    sessionStorage.removeItem('spotify-token');
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});
