import { AuthService } from './../../shared/auth.service';
import { UserProfile } from './../shared/album-interface';
import { Component } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-home-toolbar',
  templateUrl: './home-toolbar.component.html',
  styleUrls: ['./home-toolbar.component.less'],
})
export class HomeToolbarComponent {
  public userProfile = {} as UserProfile;
  constructor(public auth: AuthService) {}

  get photo(): string {
    let result = '';
    if (!_.isEmpty(this.userProfile)) {
      result = this.userProfile.images[0].url;
    }
    return result;
  }

  openUserPage(userProfile: UserProfile): void {
    const url = userProfile.external_urls.spotify;
    window.open(url, '_blank');
  }
}
