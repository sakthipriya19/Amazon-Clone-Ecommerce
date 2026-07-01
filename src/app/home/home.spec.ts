import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { Home } from './home';
import { ProductService } from '../service/product';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let productServiceSpy: { getCategories: ReturnType<typeof vi.fn>; getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productServiceSpy = {
      getCategories: vi.fn().mockReturnValue(of([])),
      getAll: vi.fn().mockReturnValue(of({ products: [], total: 0, skip: 0, limit: 0 })),
    };

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), { provide: ProductService, useValue: productServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and products on init', () => {
    component.ngOnInit();
    expect(productServiceSpy.getCategories).toHaveBeenCalled();
    expect(productServiceSpy.getAll).toHaveBeenCalled();
  });
});
