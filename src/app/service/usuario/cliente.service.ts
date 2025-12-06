import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';
import { Cliente } from '../../model/usuario/cliente';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post<Cliente>(this.apiUrl, cliente)
      .pipe(tap((novo) => console.log('Cliente criado:', novo)));
  }

  alter(cliente: Cliente): Observable<Cliente> {
    return this.http
      .put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente)
      .pipe(tap((atualizado) => console.log('Cliente alterado:', atualizado)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => console.log(`Cliente com id ${id} deletado`)));
  }

  getAll(page?: number, pageSize?: number): Observable<Cliente[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.http.get<Cliente[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.apiUrl}/${id}`)
      .pipe(tap((cliente) => console.log('Cliente carregado:', cliente)));
  }

  getByNome(nome: string): Observable<Cliente[]> {
    return this.http
      .get<Cliente[]>(`${this.apiUrl}/search/nome/${nome}`)
      .pipe(
        tap((clientes) =>
          console.log(`Clientes carregados com nome ${nome}:`, clientes)
        )
      );
  }

  getImagem(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/imagem/${id}/url`;
    return this.http.get(url, { responseType: 'blob' });
  }

  uploadImagem(id: number, arquivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', arquivo);
    const url = `${this.apiUrl}/imagem/${id}`;
    return this.http.post(url, formData);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  resetarSenha(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/resetar-senha/${id}`, {});
  }
}
