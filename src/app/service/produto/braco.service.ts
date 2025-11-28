import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Braco } from '../../model/produto/braco';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class BracoService {
  private apiUrl = `${environment.apiUrl}/bracos`;
  
  constructor(private http: HttpClient) { }

  create(braco: Braco): Observable<Braco> {
    return this.http.post<Braco>(this.apiUrl, braco).pipe(
      tap(newBraco => console.log('Braco criada:', newBraco))
    );
  }

  alter(braco: Braco): Observable<Braco> {
    return this.http.put<Braco>(`${this.apiUrl}/${braco.id}`, braco).pipe(
      tap(updatedBraco => console.log('Braco alterado:', updatedBraco))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Braco com id ${id} deletado`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Braco[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Braco[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Braco> {
    return this.http.get<Braco>(`${this.apiUrl}/${id}`).pipe(
      tap(braco => console.log(`Braco carregada:`, braco))
    );
  }

  getByFormato(formato: string): Observable<Braco[]> {
    return this.http.get<Braco[]>(`${this.apiUrl}/search/formato/${formato}`).pipe(
      tap(bracos => console.log(`Bracos carregadas com formato ${formato}:`, bracos))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
