import { JsonPipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { User } from 'src/app/model/user';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { environment } from 'src/environments/environment';
import {
  IonButton,
  IonText,
  IonList,
  IonItem,
  IonSelectOption,
  IonSelect,
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios-listado',
  templateUrl: './usuarios-listado.page.html',
  styleUrls: ['./usuarios-listado.page.scss'],
  imports: [
    IonButton,
    IonText,
  ],
})
export class UsuariosListadoPage implements OnInit, OnDestroy {
  private usuarioService = inject(UsuariosService);
  private socket?: WebSocket;
  public values = signal<any[]>([]);
  private router = inject(Router);

  public usuariosSignal = resource({
    loader: async () => await this.usuarioService.getAll(),
  });

  constructor() {}

  reload() {
    this.usuariosSignal.reload();
    const valuesArray = Object.values(this.usuariosSignal.value()!);
    this.values.set(valuesArray);
  }

  goToUsuariosLocalidades() {
    this.router.navigate(['protegida', 'usuarios', 'usuarios-localidades']);
  }

  goToLocalidadesList() {
    this.router.navigate(['protegida', 'usuarios', 'localidades-list']);
  }

  async ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.socket?.close();
  }
}
