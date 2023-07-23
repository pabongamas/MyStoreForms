import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { CategoriesService } from './../../../../core/services/categories.service';
import {Category} from './../../../../core/models/category.model'


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  form: UntypedFormGroup;
  id: string;
  categories:Category[]=[];

  constructor(
    private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private categoriesService:CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = params.id;
      this.productsService.getProduct(this.id)
      .subscribe(product => {
        console.log(product.name);
        this.form.patchValue(product);
        //esto lo hago por que el value que me retorna es diferente del backend al cual tengo en mi form
        this.form.patchValue({'categoryId':product.category.id});
      });
    });
    this.getCategories();
  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.updateProduct(this.id, product)
      .subscribe((newProduct) => {
        console.log(newProduct);
        this.router.navigate(['./admin/products']);
      });
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required,Validators.minLength(4)]],
      price: ['', [Validators.required, MyValidators.isPriceValid]],
      images: [null, [Validators.required]],
      categoryId:['',Validators.required],
      description: ['', [Validators.required,Validators.minLength(10)]],
    });
  }

  get priceField() {
    return this.form.get('price');
  }
  private getCategories(){
    this.categoriesService.getAllCategories()
    .subscribe((categories)=>{
      this.categories=categories;
    })
  }

}
