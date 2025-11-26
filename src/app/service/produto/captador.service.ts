import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Captador } from '../../model/produto/captador';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CaptadorService {
  private apiUrl = `${environment.apiUrl}/captadores`;
  
  constructor(private http: HttpClient) { }

  create(captador: Captador): Observable<Captador> {
    return this.http.post<Captador>(this.apiUrl, captador).pipe(
      tap(newCaptador => console.log('Captador criada:', newCaptador))
    );
  }

  alter(captador: Captador): Observable<Captador> {
    return this.http.put<Captador>(`${this.apiUrl}/${captador.id}`, captador).pipe(
      tap(updatedCaptador => console.log('Captador alterado:', updatedCaptador))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Captador com id ${id} deletado`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Captador[]> {
    return this.http.get<Captador[]>(this.apiUrl).pipe(
      tap(captadors => console.log('Captadors carregadas:', captadors))
    );
  }

  getById(id: number): Observable<Captador> {
    return this.http.get<Captador>(`${this.apiUrl}/${id}`).pipe(
      tap(captador => console.log(`Captador carregada:`, captador))
    );
  }

  getByFormato(formato: string): Observable<Captador[]> {
    return this.http.get<Captador[]>(`${this.apiUrl}/search/formato/${formato}`).pipe(
      tap(captadors => console.log(`Captadors carregadas com formato ${formato}:`, captadors))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
