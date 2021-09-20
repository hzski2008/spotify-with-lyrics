import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/shared/auth.service';
import {
  DialogComponent,
  ButtonPropsModel,
} from '@syncfusion/ej2-angular-popups';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  @ViewChild('ejDialog') ejDialog = {} as DialogComponent;
  private homeUrl = './home';

  public hideDialog = (): void => {
    this.ejDialog.hide();
  };
  // Enables the dialog footer buttons
  public buttons: ButtonPropsModel[] = [
    {
      click: this.hideDialog.bind(this),
      buttonModel: {
        content: 'OK',
        isPrimary: true,
      },
    },
  ];

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit(): void {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      this.auth.setAccessToken(code, () => {
        this.router.navigate([this.homeUrl]);
      });
    }
  }

  public onSubmit(form: { userName: string; userPassword: string }): void {
    console.log('User name: ', form.userName);
    this.onOpenDialog();
  }

  public onOpenDialog(): void {
    // Call the show method to open the Dialog
    this.ejDialog.show();
  }
}
