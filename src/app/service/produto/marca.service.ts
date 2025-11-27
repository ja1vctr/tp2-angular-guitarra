import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Marca } from '../../model/produto/marca';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MarcaService {
  private apiUrl = `${environment.apiUrl}/marcas`;
  
  constructor(private http: HttpClient) { }

  create(marca: Marca): Observable<Marca> {
    return this.http.post<Marca>(this.apiUrl, marca).pipe(
      tap(newMarca => console.log('Marca criada:', newMarca))
    );
  }

  alter(marca: Marca): Observable<Marca> {
    return this.http.put<Marca>(`${this.apiUrl}/${marca.id}`, marca).pipe(
      tap(updatedMarca => console.log('Marca alterada:', updatedMarca))
    );
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Marca com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Marca[]> {
    return this.http.get<Marca[]>(this.apiUrl).pipe(
      tap(marcas => console.log('Marcas carregadas:', marcas))
    );
  }

  getById(id: number): Observable<Marca> {
    return this.http.get<Marca>(`${this.apiUrl}/${id}`).pipe(
      tap(marca => console.log(`Marca carregada:`, marca))
    );
  }

  getByNome(nome: string): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/search/nome/${nome}`).pipe(
      tap(marcas => console.log(`Marcas carregadas com nome ${nome}:`, marcas))
    );
  }

  getModelosByMarcaId(marcaId: number): Observable<Marca[]> {
    return this.http.get<Marca[]>(`${this.apiUrl}/${marcaId}/modelos`).pipe(
      tap(marcas => console.log(`Modelos carregados para a marca id ${marcaId}:`, marcas))
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
