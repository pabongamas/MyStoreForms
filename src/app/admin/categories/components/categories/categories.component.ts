import { Component, OnInit } from '@angular/core';
import {CategoriesService} from './../../../../core/services/categories.service'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories = [];
  displayedColumns: string[] = ['id', 'name', 'image', 'actions'];
  constructor(
    private categoriesService:CategoriesService
  ) { }

  ngOnInit(): void {
    this.categoriesService.getAllCategories()
    .subscribe(data=>{
      this.categories=data;
    })
  }
  deleteCategory(id:string){

  }

}
