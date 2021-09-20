import { HomeToolbarComponent } from './home-toolbar/home-toolbar.component';
import { forkJoin } from 'rxjs';
import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { SpotifyApiService } from 'app/shared/spotify-api.service';
import * as _ from 'lodash';
import { concatMap } from 'rxjs/operators';
import { UserProfile, TrackDetails, PlayList } from './shared/album-interface';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth.service';
import {
  TreeViewComponent,
  NodeSelectEventArgs,
} from '@syncfusion/ej2-angular-navigations';
import { HomeContentComponent } from './home-content/home-content.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  public userProfile = {} as UserProfile;
  private tracksById = {} as { [key: string]: TrackDetails };
  public selectedTrack = {} as TrackDetails;
  private refreshInterval = 0;
  @ViewChild('playlistTree', { static: true }) tree = {} as TreeViewComponent;
  @ViewChild('homeToolbar', { static: true }) homeToolbar =
    {} as HomeToolbarComponent;
  @ViewChild('homeContent', { static: true }) homeContent =
    {} as HomeContentComponent;

  public field: {
    id?: string;
    text?: string;
    child?: string;
    expanded?: string;
    dataSource?: { [key: string]: any };
  } = {
    id: 'id',
    text: 'name',
    child: 'child',
    expanded: 'expanded',
  };

  constructor(
    private spotifyApi: SpotifyApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.refreshInterval = this.auth.refreshAccessToken();
    this.getSpotifyData();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private getSpotifyData(): void {
    this.spotifyApi
      .getUserProfile()
      .pipe(
        concatMap((userProfile) => {
          console.log('User profile: ', userProfile);
          this.userProfile = userProfile;
          this.homeToolbar.userProfile = this.userProfile;
          return this.spotifyApi.getPlayListsById(this.userProfile.id);
        }),
        concatMap((playlists) => {
          console.log('User playlists:', playlists);
          const tracksOfLists = playlists.items.map((list: PlayList) =>
            this.spotifyApi.getTracks(list.id)
          );
          return forkJoin(tracksOfLists);
        })
      )
      .subscribe(
        (resp) => {
          const tracks = this.parsePlaylists(resp as PlayList[]);
          const data: any = this.getHierarchy(tracks);
          this.field = { dataSource: data };
        },
        (error) => {
          console.log('error:', error);
          this.router.navigate(['./login']);
        }
      );
  }

  private parsePlaylists(playlists: PlayList[]) {
    const clonedPlaylists = _.cloneDeep(playlists);
    for (const playlist of clonedPlaylists) {
      (playlist as any).expanded = true;
      (playlist as any).child = this.AddTracks(_.get(playlist, 'tracks.items'));
    }
    return clonedPlaylists;
  }

  private AddTracks(tracks: TrackDetails[]) {
    const children = _.cloneDeep(tracks);
    for (const child of children) {
      child['name'] = _.get(child, 'track.name');
      child['id'] = _.get(child, 'track.id');
      this.tracksById[_.get(child, 'track.id')] = _.get(child, 'track');
      if (_.isEmpty(this.selectedTrack)) {
        this.selectedTrack = _.get(child, 'track');
      }
    }
    return children;
  }

  public selectTrack(event?: NodeSelectEventArgs): void {
    const target = this.tracksById[this.tree.selectedNodes[0]];
    if (target) {
      this.selectedTrack = target;
      this.homeContent.setLyrics('Getting lyrics...');
      this.spotifyApi.getLyrics(target).subscribe(
        (res) => {
          this.homeContent.setLyrics((res as any).lyrics);
        },
        (error) => {
          console.log('error to get lyrics', error);
        }
      );
    }
  }

  private getHierarchy(data: any) {
    const root: {
      id: string;
      name: string;
      expanded: boolean;
      selected: true;
      child: any;
    } = {
      id: '0',
      name: `${_.get(
        this,
        'userProfile.display_name',
        'loading...'
      )}'s playlist`,
      expanded: true,
      selected: true,
      child: {},
    };
    for (const item of data) {
      item['expanded'] = true;
    }
    root['child'] = data;
    return [root];
  }
}
