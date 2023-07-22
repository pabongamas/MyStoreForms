import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import {CategoriesService} from './../../../../core/services/categories.service';
import {Category} from './../../../../core/models/category.model'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit{
  category:Category;
  constructor(
    private categoriesService:CategoriesService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
  ){}
 
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params:Params)=>{
      if(params.id){
        this.getCategory(params.id);
      }
    });
  }

   CreateCategory(data){
    this.categoriesService.createCategory(data)
    .subscribe(rta=>{
      this.router.navigate(['./admin/categories']);
    });
  }
   updateCategory(data){
    this.categoriesService.updateCategory(this.category.id,data)
    .subscribe(rta=>{
      this.router.navigate(['./admin/categories']);
    });
  }
  private getCategory(id:string){
    this.categoriesService.getCategory(id)
    .subscribe(data=>{
      this.category=data;
      // puede ser asi
      // this.form.patchValue(data);
      // o aasi
      // this.nameField.setValue(data.data);
    });
  }
}
