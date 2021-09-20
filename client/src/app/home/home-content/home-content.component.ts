import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { TrackDetails, Artist } from './../shared/album-interface';

@Component({
  selector: 'app-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.less'],
})
export class HomeContentComponent {
  @Input() track = {} as TrackDetails;
  public lyrics = '';

  setLyrics(lyrics: string): void {
    this.lyrics = lyrics;
  }

  public openArtistLink(artist: Artist): void {
    const url = (artist as Artist).external_urls.spotify;
    window.open(url, '_blank');
  }

  public openAlbumLink(trackDetails: TrackDetails): void {
    const url = trackDetails.album.external_urls.spotify;
    window.open(url, '_blank');
  }
}
