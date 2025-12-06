import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Tarraxa } from '../../model/produto/tarraxa';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TarraxaService {
  private apiUrl = `${environment.apiUrl}/tarrachas`;
  
  constructor(private http: HttpClient) { }

  create(tarraxa: Tarraxa): Observable<Tarraxa> {
    return this.http.post<Tarraxa>(this.apiUrl, tarraxa).pipe(
      tap(newTarraxa => console.log('Tarraxa criada:', newTarraxa))
    );
  }

  alter(tarraxa: Tarraxa): Observable<Tarraxa> {
    return this.http.put<Tarraxa>(`${this.apiUrl}/${tarraxa.id}`, tarraxa).pipe(
      tap(updatedTarraxa => console.log('Tarraxa alterada:', updatedTarraxa))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Tarraxa com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Tarraxa[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Tarraxa[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Tarraxa> {
    return this.http.get<Tarraxa>(`${this.apiUrl}/${id}`).pipe(
      tap(tarraxa => console.log(`Tarraxa carregada:`, tarraxa))
    );
  }

  getByModelo(modelo: string): Observable<Tarraxa[]> {
    return this.http.get<Tarraxa[]>(`${this.apiUrl}/search/modelo/${modelo}`).pipe(
      tap(tarraxas => console.log(`Tarraxas carregadas com modelo ${modelo}:`, tarraxas))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
