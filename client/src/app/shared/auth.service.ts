import { Injectable } from '@angular/core';
//import { Observable, BehaviorSubject, bindNodeCallback, of } from "rxjs";
import { Router } from '@angular/router';
import secrets from '../../../secret';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

abstract class SpotifyApi {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static readonly authEndpoint = 'https://accounts.spotify.com/authorize';
  static readonly clientId = secrets.spotifyClientId;
  static readonly redirectUri = 'http://localhost:4300';
  static readonly scopes = [
    // "user-read-currently-playing",
    // "user-read-playback-state",
    'user-read-private',
    'user-read-email',
    'streaming',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    // "playlist-modify-public",
    // "playlist-modify-private"
  ];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _spotifyToken = 'spotify-token';
  private _token = '';
  private refreshToken = '';
  private expiresIn = 0;
  public loginUrl = './login';
  public homeUrl = './home';

  constructor(private router: Router, private http: HttpClient) {}

  get token(): string {
    if (this._token) {
      return this._token;
    }
    const { accessToken, expiresIn, refreshToken } =
      this.getFromSessionStorage();
    if (accessToken && expiresIn && refreshToken) {
      this._token = accessToken;
      this.expiresIn = expiresIn;
      this.refreshToken = refreshToken;
    } else {
      console.log(
        'Access token not avilable: ' +
          accessToken +
          ' ' +
          expiresIn +
          ' ' +
          refreshToken
      );
    }

    return this._token;
  }

  set token(tokenStr: string) {
    this._token = tokenStr;
  }

  refreshAccessToken(): any {
    if (!this.refreshToken || !this.expiresIn) {
      return;
    }
    const tokenInterval = setInterval(() => {
      this.http
        .post(
          'http://localhost:4001/refresh',
          { refreshToken: this.refreshToken },
          {}
        )
        .subscribe(
          (response) => {
            console.log('token refreshed!');
            this.token = (response as any).accessToken;
            this.expiresIn = (response as any).expiresIn;
            this.saveToSessionStorage({
              token: this.token,
              expiredIn: this.expiresIn,
              refreshToken: this.refreshToken,
            });
          },
          (error) => {
            window.location.href = '/';
          }
        );
    }, (this.expiresIn - 60) * 1000);

    return tokenInterval;
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  login(): void {
    let params: HttpParams = new HttpParams();
    params = params
      .set('client_id', SpotifyApi.clientId)
      .set('redirect_uri', SpotifyApi.redirectUri)
      .set('scope', `${SpotifyApi.scopes.join(' ')}`)
      .set('response_type', 'code')
      .set('show_dialog', 'true');

    const url = `${SpotifyApi.authEndpoint}?${params.toString()}`;
    window.location.href = url;
  }

  private saveToSessionStorage(tokenObj: any): void {
    const { token, expiresIn, refreshToken } = tokenObj;
    if (!token || !expiresIn || !refreshToken) {
      return;
    }
    const accessToken = btoa(token);
    sessionStorage.setItem(
      this._spotifyToken,
      JSON.stringify({ accessToken, expiresIn, refreshToken })
    );
  }

  private getFromSessionStorage() {
    const tokenStr = sessionStorage.getItem(this._spotifyToken);
    if (tokenStr) {
      const tokenObj = JSON.parse(tokenStr);
      if (
        tokenObj &&
        tokenObj.accessToken &&
        tokenObj.expiresIn &&
        tokenObj.refreshToken
      ) {
        // check if token is expried
        const accessToken = atob(tokenObj.accessToken); // decode token
        return { ...tokenObj, accessToken: accessToken };
      } else {
        console.log('Access token not avilable, ', tokenObj);
      }
    }
  }

  setAccessToken(code: string, success: any): void {
    this.http.post('http://localhost:4001/login', { code }, {}).subscribe(
      (response) => {
        this.token = (response as any).accessToken;
        this.refreshToken = (response as any).refreshToken;
        this.expiresIn = (response as any).expiresIn;
        this.saveToSessionStorage({
          token: this.token,
          refreshToken: this.refreshToken,
          expiresIn: this.expiresIn,
        });
        success();
      },
      (error) => {
        window.location.href = '/';
      }
    );
  }

  logout(): void {
    sessionStorage.removeItem(this._spotifyToken);
    this._token = '';
    this.expiresIn = 0;
    this.refreshToken = '';
    const url = 'https://accounts.spotify.com/en/logout';
    const spotifyLogoutWindow = window.open(
      url,
      'Spotify Logout',
      'width=700,height=500,top=40,left=40'
    );
    setTimeout(() => spotifyLogoutWindow?.close(), 2000);
    this.router.navigate([this.loginUrl]);
  }
}
