import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Tarracha } from '../../model/produto/tarracha';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TarrachaService {
  private apiUrl = `${environment.apiUrl}/tarrachas`;
  
  constructor(private http: HttpClient) { }

  create(tarracha: Tarracha): Observable<Tarracha> {
    return this.http.post<Tarracha>(this.apiUrl, tarracha).pipe(
      tap(newTarracha => console.log('Tarracha criada:', newTarracha))
    );
  }

  alter(tarracha: Tarracha): Observable<Tarracha> {
    return this.http.put<Tarracha>(`${this.apiUrl}/${tarracha.id}`, tarracha).pipe(
      tap(updatedTarracha => console.log('Tarracha alterada:', updatedTarracha))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Tarracha com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Tarracha[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Tarracha[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Tarracha> {
    return this.http.get<Tarracha>(`${this.apiUrl}/${id}`).pipe(
      tap(tarracha => console.log(`Tarracha carregada:`, tarracha))
    );
  }

  getByNome(nome: string): Observable<Tarracha[]> {
    return this.http.get<Tarracha[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(tarrachas => console.log(`Tarrachas carregadas com nome ${nome}:`, tarrachas))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
