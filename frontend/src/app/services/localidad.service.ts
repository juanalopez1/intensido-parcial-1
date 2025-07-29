import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocalidadService {
  constructor() {}
  private http = inject(HttpClient);

  getAll(depto: string) {
    const urlComplete = `https://direcciones.ide.uy/api/v0/geocode/localidades?departamento=${depto}`;
    return firstValueFrom(this.http.get(urlComplete));
  }
}
