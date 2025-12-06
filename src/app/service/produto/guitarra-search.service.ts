import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GuitarraSearchService {
  private querySubject = new BehaviorSubject<string>('');
  query$ = this.querySubject.asObservable();
  private pageSubject = new BehaviorSubject<{page:number, pageSize:number}>({page:0, pageSize:10});
  page$ = this.pageSubject.asObservable();

  setQuery(value: string): void {
    this.querySubject.next(value ?? '');
  }

  setPage(page: number, pageSize: number): void {
    this.pageSubject.next({page, pageSize});
  }
}
