import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { finalize } from 'rxjs/operators';

import { MyValidators } from './../../../../utils/validators';
import { ProductsService } from './../../../../core/services/products/products.service';
import { CategoriesService } from './../../../../core/services/categories.service';
import { Category } from './../../../../core/models/category.model';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  form: UntypedFormGroup;
  image$: Observable<any>;
  categories:Category[]=[];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private productsService: ProductsService,
    private router: Router,
    private storage: AngularFireStorage,
    private categoriesService:CategoriesService
  ) {
    this.buildForm();
  }

  ngOnInit() {
    this.getCategories();
  }

  saveProduct(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      const product = this.form.value;
      this.productsService.createProduct(product)
      .subscribe((newProduct) => {
        console.log(newProduct);
        this.router.navigate(['./admin/products']);
      });
    }
  }

  uploadFile(event) {
    const files = event.target.files;
  
    const currentValue = this.form.get('images').value || [];
    for (let file of files){
      const name = file.name;
      const fileRef = this.storage.ref(name);
      const task = this.storage.upload(name, file);
         task.snapshotChanges()
        .pipe(
            finalize(() => {
            this.image$ = fileRef.getDownloadURL();
            this.image$.subscribe((url) => {
            currentValue.push(url)
            this.form.patchValue({ images: currentValue });
            });
          })
      )
      .subscribe();
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
  get titleField(){
    return this.form.get('title');
  }
  get descriptionField(){
    return this.form.get('description');
  }
  get imageField(){
    return this.form.get('images');
  }
  private getCategories(){
    this.categoriesService.getAllCategories()
    .subscribe((categories)=>{
      this.categories=categories;
    })
  }
}
