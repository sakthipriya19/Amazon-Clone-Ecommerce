import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, Product, ProductListResponse } from '../interface/product.interface';

export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  private buildParams(params: ProductQueryParams = {}): URLSearchParams {
    const query = new URLSearchParams();
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.skip !== undefined) query.set('skip', String(params.skip));
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.order) query.set('order', params.order);
    return query;
  }

  getAll(params: ProductQueryParams = {}): Observable<ProductListResponse> {
    const query = this.buildParams(params);
    const str = query.toString();
    return this.http.get<ProductListResponse>(`${this.baseUrl}${str ? '?' + str : ''}`);
  }

  getByCategory(slug: string, params: ProductQueryParams = {}): Observable<ProductListResponse> {
    const query = this.buildParams(params);
    const str = query.toString();
    return this.http.get<ProductListResponse>(
      `${this.baseUrl}/category/${slug}${str ? '?' + str : ''}`,
    );
  }

  search(query: string, params: ProductQueryParams = {}): Observable<ProductListResponse> {
    const extra = this.buildParams(params);
    extra.set('q', query);
    return this.http.get<ProductListResponse>(`${this.baseUrl}/search?${extra.toString()}`);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }
}
