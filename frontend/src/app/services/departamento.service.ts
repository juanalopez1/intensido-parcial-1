import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  constructor() { }
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  getAll() {
    const urlComplete = this.url + 'departamentos';
    return firstValueFrom(this.http.get(urlComplete));
  }
}
