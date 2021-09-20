import { TestBed } from '@angular/core/testing';
import { SpotifyApiService } from './spotify-api.service';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpotifyApiService', () => {
  let service: SpotifyApiService;
  const authServiceStub = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    login: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: authServiceStub }],
    });
    service = TestBed.inject(SpotifyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
