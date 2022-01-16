import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, pluck, switchMap, tap } from 'rxjs/operators';


interface Article {
  title: string;
  url: string;
}

interface NewsApiReponse {
  totalResults: number;
  articles:Article[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  private url = 'https://newsapi.org/v2/top-headlines';
  private pageSize = 10;
  private apiKey = '90a7890276be4c17b435e5ec608ba40e';
  private country = 'pt';

  private pagesInput: Subject<number>;
  pagesOutput: Observable<Article[]>;
  numberOfPages: Subject<number>;

  constructor(private http: HttpClient) { 
    this.pagesInput = new Subject();
    this.numberOfPages = new Subject();

    this.pagesOutput= this.pagesInput.pipe(
        map((page) =>{
            return new HttpParams()
            .set('apiKey', this.apiKey)
            .set('country', this.country)
            .set('pageSize', String(this.pageSize))
            .set('page', String(page));
        }),
        switchMap(params => {
          return this.http.get<NewsApiReponse>(this.url, {params});
          
        }),
        tap(response => {
          const totalPages = Math.ceil(response.totalResults / this.pageSize)
          this.numberOfPages.next(totalPages);
        }),
        pluck('articles')
    
           
        );
  }
}


