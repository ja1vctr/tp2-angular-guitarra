import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Modelo } from '../../model/produto/modelo';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ModeloService {
  private apiUrl = `${environment.apiUrl}/modelos`;
  
  constructor(private http: HttpClient) { }

  create(modelo: Modelo): Observable<Modelo> {
    return this.http.post<Modelo>(this.apiUrl, modelo).pipe(
      tap(newModelo => console.log('Modelo criada:', newModelo))
    );
  }

  alter(modelo: Modelo): Observable<Modelo> {
    return this.http.put<Modelo>(`${this.apiUrl}/${modelo.id}`, modelo).pipe(
      tap(updatedModelo => console.log('Modelo alterada:', updatedModelo))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Modelo com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Modelo[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Modelo[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Modelo> {
    return this.http.get<Modelo>(`${this.apiUrl}/${id}`).pipe(
      tap(modelo => console.log(`Modelo carregada:`, modelo))
    );
  }

  getByNome(nome: string): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(modelos => console.log(`Modelos carregadas com nome ${nome}:`, modelos))
    );
  }

  getMarcasByModeloId(modeloId: number): Observable<Modelo[]> {
    return this.http.get<Modelo[]>(`${this.apiUrl}/${modeloId}/marcas`).pipe(
      tap(modelos => console.log(`Marcas carregadas para o modelo id ${modeloId}:`, modelos))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
