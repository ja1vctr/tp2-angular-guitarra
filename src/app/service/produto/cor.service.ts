import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Cor } from '../../model/produto/cor';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CorService {
  private apiUrl = `${environment.apiUrl}/cores`;
  
  constructor(private http: HttpClient) { }

  create(cor: Cor): Observable<Cor> {
    return this.http.post<Cor>(this.apiUrl, cor).pipe(
      tap(newCor => console.log('Cor criada:', newCor))
    );
  }

  alter(cor: Cor): Observable<Cor> {
    return this.http.put<Cor>(`${this.apiUrl}/${cor.id}`, cor).pipe(
      tap(updatedCor => console.log('Cor alterada:', updatedCor))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Cor com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Cor[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Cor[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Cor> {
    return this.http.get<Cor>(`${this.apiUrl}/${id}`).pipe(
      tap(cor => console.log(`Cor carregada:`, cor))
    );
  }

  getByNome(nome: string): Observable<Cor[]> {
    return this.http.get<Cor[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(cores => console.log(`Cores carregadas com nome ${nome}:`, cores))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
