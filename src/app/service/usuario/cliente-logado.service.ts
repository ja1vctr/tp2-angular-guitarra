import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Cliente } from '../../model/usuario/cliente';

export interface ClienteUpdatePayload {
  permitirMarketing: boolean;
  cpf: string;
  dataNascimento: string | Date;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class ClienteLogadoService {
  private apiUrl = `${environment.apiUrl}/clienteLogado`;

  constructor(private http: HttpClient) {}

  get(): Observable<Cliente> {
    return this.http.get<Cliente>(this.apiUrl);
  }

  update(payload: ClienteUpdatePayload): Observable<void> {
    return this.http.put<void>(this.apiUrl, payload);
  }

  alterarSenha(novaSenha: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/alterar-senha`, null, {
      params: { novaSenha },
    });
  }

  alterarEmail(novoEmail: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/alterar-email`, null, {
      params: { novoEmail },
    });
  }

  getImagem(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/imagem`, { responseType: 'blob' });
  }

  uploadImagem(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/imagem`, formData);
  }
}
