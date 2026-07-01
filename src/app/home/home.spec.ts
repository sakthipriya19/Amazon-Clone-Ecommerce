import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Home } from './home';
import { Ecommerceservice } from '../service/ecommerceservice';
import { ecommerce } from '../interface/ecoomerceinterface';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let ecommerceServiceSpy: jasmine.SpyObj<Ecommerceservice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: Ecommerceservice, useValue: jasmine.createSpyObj('Ecommerceservice', ['getClothingDetails']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    ecommerceServiceSpy = TestBed.inject(Ecommerceservice);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalledTimes(1);
  });

  it('should call loadProductDetails', () => {
    spyOn(component, 'loadProductDetails');
    component.ngOnInit();
    expect(component.loadProductDetails).toHaveBeenCalledTimes(1);
  });

  it('should call ecommerceService.getClothingDetails', () => {
    component.loadProductDetails();
    expect(ecommerceServiceSpy.getClothingDetails).toHaveBeenCalledTimes(1);
  });

  it('should update loadItems', () => {
    const data = [{ id: 1, name: 'Test' }];
    ecommerceServiceSpy.getClothingDetails.and.returnValue(of(data));
    component.loadProductDetails();
    fixture.detectChanges();
    expect(component.loadItems).toEqual(data);
  });

  it('should not update loadItems if ecommerceService.getClothingDetails returns error', () => {
    ecommerceServiceSpy.getClothingDetails.and.returnValue(throwError('Error'));
    component.loadProductDetails();
    fixture.detectChanges();
    expect(component.loadItems).toEqual([]);
  });
});