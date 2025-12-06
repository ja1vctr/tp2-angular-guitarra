import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { tap } from 'rxjs/operators';
import { Guitarra } from '../../model/produto/guitarra';
import { Injectable } from '@angular/core';
import { GuitarraPayload } from '../../model/produto/guitarra-payload';


@Injectable({
  providedIn: 'root'
})
export class GuitarraService {
  private apiUrl = `${environment.apiUrl}/guitarras`;
  
  constructor(private http: HttpClient) { }

  create(guitarra: GuitarraPayload): Observable<Guitarra> {
    return this.http.post<Guitarra>(this.apiUrl, guitarra);
  }

  alter(guitarra: GuitarraPayload): Observable<Guitarra> {
    return this.http.put<Guitarra>(`${this.apiUrl}/${guitarra.id}`, guitarra);
  } 

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`Guitarra com id ${id} deletada`))
    );
  } 

  getAll(page?: number, pageSize?: number): Observable<Guitarra[]> {
    let params: any = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }

    return this.http.get<Guitarra[]>(this.apiUrl, { params });
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

  getImagem(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/imagem/${id}/url`;
    return this.http.get(url, { responseType: 'blob' });
  }

  // No guitarra.service.ts
  uploadImagem(id: number, arquivo: File): Observable<any> {
      const formData = new FormData();
      formData.append('file', arquivo); // 'file' deve corresponder ao @RestForm("file")

      const url = `${this.apiUrl}/imagem/${id}`;
      return this.http.post(url, formData); // Sem Content-Type, o browser configura 'multipart/form-data'
  }
  
  updateStatus(id: number, status: boolean): Observable<any> {
    const url = `${this.apiUrl}/${id}/status`;
    return this.http.put(url, { status });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
