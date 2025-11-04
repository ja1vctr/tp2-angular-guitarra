import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Guitarra } from '../../model/produto/guitarra';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GuitarraService {
  private apiUrl = `${environment.apiUrl}/guitarras`;
  
  constructor(private http: HttpClient) { }

  create(guitarra: Guitarra): Observable<Guitarra> {
    return this.http.post<Guitarra>(this.apiUrl, guitarra).pipe(
      tap(newGuitarra => console.log('Guitarra criada:', newGuitarra))
    );
  }

  alter(guitarra: Guitarra): Observable<Guitarra> {
    return this.http.put<Guitarra>(`${this.apiUrl}/${guitarra.id}`, guitarra).pipe(
      tap(updatedGuitarra => console.log('Guitarra alterada:', updatedGuitarra))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Guitarra com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Guitarra[]> {
    return this.http.get<Guitarra[]>(this.apiUrl).pipe(
      tap(guitarras => console.log('Guitarras carregadas:', guitarras))
    );
  }

  getById(id: number): Observable<Guitarra> {
    return this.http.get<Guitarra>(`${this.apiUrl}/${id}`).pipe(
      tap(guitarra => console.log(`Guitarra carregada:`, guitarra))
    );
  }

  getByNome(nome: string): Observable<Guitarra[]> {
    return this.http.get<Guitarra[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(guitarras => console.log(`Guitarras carregadas com nome ${nome}:`, guitarras))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
