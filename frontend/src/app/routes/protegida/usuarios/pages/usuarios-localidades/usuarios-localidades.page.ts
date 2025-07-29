import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonList, IonItem, IonText, IonSelectOption, IonSelect, IonButton } from '@ionic/angular/standalone';
import { DepartamentoService } from 'src/app/services/departamento.service';

@Component({
  selector: 'app-usuarios-localidades',
  templateUrl: './usuarios-localidades.page.html',
  styleUrls: ['./usuarios-localidades.page.scss'],
  imports: [
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonButton
],
})
export class UsuariosLocalidadesPage implements OnInit {


  public depto = signal<string>('');
  public deptosService =inject(DepartamentoService)
  public values = signal<any[]>([]);
  public departamentos = resource({
    loader: async () => await this.deptosService.getAll(),
  });

  reload() {
    this.departamentos.reload();
    const valuesArray = Object.values(this.departamentos.value()!);
    this.values.set(valuesArray);
  }

  constructor() {}

  ngOnInit() {

  }
}
