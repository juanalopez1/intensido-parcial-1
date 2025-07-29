import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonMenu, IonToolbar, IonHeader, IonTitle, IonContent, IonMenuToggle, IonButton, IonButtons, IonMenuButton, IonRouterOutlet} from "@ionic/angular/standalone";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-authed',
  templateUrl: './authed.layout.html',
  styleUrls: ['./authed.layout.scss'],
  imports: [IonMenu, RouterLink, IonToolbar, IonHeader, IonTitle, IonContent, IonMenuToggle, IonButton, IonButtons, IonMenuButton, IonRouterOutlet],
})
export class AuthedLayout  implements OnInit {

  public authService = inject(AuthService);
  constructor() { }

  ngOnInit() {
    
    console.log("Init AuthedLayout");
  }

}
