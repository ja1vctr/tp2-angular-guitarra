import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Funcionario } from '../../model/usuario/funcionario';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {
  private apiUrl = `${environment.apiUrl}/funcionarios`;
  private logadoUrl = `${environment.apiUrl}/funcionarioLogado`;

  constructor(private http: HttpClient) {}

  create(funcionario: Funcionario): Observable<Funcionario> {
    return this.http
      .post<Funcionario>(this.apiUrl, funcionario)
      .pipe(
        tap((newFuncionario) =>
          console.log('Funcionario criada:', newFuncionario)
        )
      );
  }

  alter(funcionario: Funcionario): Observable<Funcionario> {
    return this.http
      .put<Funcionario>(`${this.apiUrl}/${funcionario.id}`, funcionario)
      .pipe(
        tap((updatedFuncionario) =>
          console.log('Funcionario alterada:', updatedFuncionario)
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => console.log(`Funcionario com id ${id} deletada`)));
  }

  getAll(page?: number, pageSize?: number): Observable<Funcionario[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.http.get<Funcionario[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Funcionario> {
    return this.http
      .get<Funcionario>(`${this.apiUrl}/${id}`)
      .pipe(
        tap((funcionario) => console.log(`Funcionario carregada:`, funcionario))
      );
  }

  getByNome(nome: string): Observable<Funcionario[]> {
    return this.http
      .get<Funcionario[]>(`${this.apiUrl}/search/nome/${nome}`)
      .pipe(
        tap((funcionarios) =>
          console.log(`Funcionarios carregadas com nome ${nome}:`, funcionarios)
        )
      );
  }

  getImagem(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/imagem/${id}/url`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // No funcionario.service.ts
  uploadImagem(id: number, arquivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', arquivo); // 'file' deve corresponder ao @RestForm("file")

    const url = `${this.apiUrl}/imagem/${id}`;
    return this.http.post(url, formData); // Sem Content-Type, o browser configura 'multipart/form-data'
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getLogado(): Observable<Funcionario> {
    return this.http.get<Funcionario>(this.logadoUrl);
  }

  alterarSenhaLogado(novaSenha: string): Observable<void> {
    return this.http.patch<void>(`${this.logadoUrl}/alterar-senha`, null, {
      params: { novaSenha },
    });
  }
}
