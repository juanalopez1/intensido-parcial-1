import {
  Component,
  inject,
  linkedSignal,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonText,
  IonSelectOption,
  IonSelect,
  IonButton,
} from '@ionic/angular/standalone';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { LocalidadService } from 'src/app/services/localidad.service';

@Component({
  selector: 'app-localidades-list',
  templateUrl: './localidades-list.page.html',
  styleUrls: ['./localidades-list.page.scss'],
  imports: [
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonButton,
  ],
})
export class LocalidadesListPage implements OnInit {
  public depto = signal<string>('');
  public deptosService = inject(DepartamentoService);
  public localityService = inject(LocalidadService);

  public values = signal<any[]>([]);
  public values2 = signal<any[]>([]);
  public locality = linkedSignal(() => this.values2()[0].nombre);
  public departamentos = resource({
    loader: async () => await this.deptosService.getAll(),
  });
  public localities = resource({
    loader: async () => {
      const res = await this.localityService.getAll(this.depto());
      return res;
    },
  });

  reload() {
    this.departamentos.reload();
    const valuesArray = Object.values(this.departamentos.value()!);
    this.values.set(valuesArray);
  }

  reload2() {
    this.localities.reload();
    const valuesArray = Object.values(this.localities.value()!);
    this.values2.set(valuesArray);
  }
  constructor() {}

  ngOnInit() {}
}
