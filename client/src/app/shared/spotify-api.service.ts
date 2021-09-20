import { UserProfile, PlayListItems, TrackDetails, PlayList } from './../home/shared/album-interface';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpotifyApiService {
  private baseUrl = 'https://api.spotify.com/v1';
  readonly auth_header: { headers: HttpHeaders };

  constructor(private http: HttpClient, private auth: AuthService) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.auth.token}`,
      'Content-Type': 'application/json',
    });
    this.auth_header = { headers };
  }

  getUserPlayLists(): Observable<PlayListItems> {
    return this.http.get<PlayListItems>(`${this.baseUrl}/me/playlists`, this.auth_header);
  }

  getPlayListsById(userId: number | string): Observable<PlayListItems> {
    return this.http.get<PlayListItems>(
      `${this.baseUrl}/users/${userId}/playlists`,
      this.auth_header
    );
  }

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/me`, this.auth_header);
  }

  getTracks(playListId: string | number): Observable<PlayList> {
    return this.http.get<PlayList>(
      `${this.baseUrl}/playlists/${playListId}`,
      this.auth_header
    );
  }

  getTrackById(id: number | string): Observable<TrackDetails> {
    return this.http.get<TrackDetails>(`${this.baseUrl}/tracks/${id}`, this.auth_header);
  }

  getLyrics(track: TrackDetails): Observable<string> {
    return this.http.get<string>('http://localhost:4001/lyrics?track=' + encodeURIComponent(track.name) + '&' + 'artist=' + encodeURIComponent(track.artists[0].name), {});
  }
}
