import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Ponte } from '../../model/produto/ponte';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class PonteService {
  private apiUrl = `${environment.apiUrl}/pontes`;
  
  constructor(private http: HttpClient) { }

  create(ponte: Ponte): Observable<Ponte> {
    return this.http.post<Ponte>(this.apiUrl, ponte).pipe(
      tap(newPonte => console.log('Ponte criada:', newPonte))
    );
  }

  alter(ponte: Ponte): Observable<Ponte> {
    return this.http.put<Ponte>(`${this.apiUrl}/${ponte.id}`, ponte).pipe(
      tap(updatedPonte => console.log('Ponte alterada:', updatedPonte))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Ponte com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Ponte[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Ponte[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Ponte> {
    return this.http.get<Ponte>(`${this.apiUrl}/${id}`).pipe(
      tap(ponte => console.log(`Ponte carregada:`, ponte))
    );
  }

  getByNome(nome: string): Observable<Ponte[]> {
    return this.http.get<Ponte[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(pontes => console.log(`Pontes carregadas com nome ${nome}:`, pontes))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
