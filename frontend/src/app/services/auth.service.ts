import { inject, Injectable } from '@angular/core';
import { MainStoreService } from './main-store.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mainStore = inject(MainStoreService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.loadToken();
  }

  public async setToken(token: string) {
    localStorage.clear();
    localStorage.setItem('TOKEN', token);
    return this.loadToken();
  }

  logOut() {
    localStorage.removeItem('TOKEN');
    this.router.navigate(["/auth/login"])
  }

  public async loadToken() {
    const token = localStorage.getItem('TOKEN');
    console.log('Token del localstorage: ', token);

    if (!token) return;

    this.mainStore.token.set(token);
    try {
      const usuario = await firstValueFrom(
        this.httpClient.get<User>(environment.apiUrl + 'auth/profile', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
      );
      this.mainStore.usuario.set(usuario);

      console.log('Token valido: ', { usuario });
      this.router.navigate(['/protegida']);
    } catch (error) {
      console.log({ error });
      this.mainStore.token.set(undefined);
      this.mainStore.usuario.set(undefined);
    }
  }
}
