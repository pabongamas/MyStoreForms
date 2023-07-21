import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, StorageReference } from '@angular/fire/storage';
import {MyValidators} from './../../../../utils/validators'
import {FormControl,Validators,FormBuilder, FormGroup} from '@angular/forms'

import {CategoriesService} from './../../../../core/services/categories.service'
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {

  form:FormGroup;
  categoryId:string;

  constructor(
    private formBuilder:FormBuilder,
    private categoriesService:CategoriesService,
    private router:Router,
    private storage: Storage,
    private activatedRoute:ActivatedRoute,
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params:Params)=>{
      this.categoryId=params.id;
      if(this.categoryId){
        this.getCategory();
      }
    });
  }
  private buildForm(){
    //se comenta validacion para ver si esta disponible ,porque el endpoint a donde apunta este para validar la categoria no existe con la api escuela js
    this.form=this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      // name: ['', [Validators.required, Validators.minLength(4)], MyValidators.validateCategory(this.categoriesService)],
      image:['',Validators.required]
    })
  }
  get nameField(){
    return this.form.get('name');
  }
  get imageField(){
    return this.form.get('image');
  }
  save(){
    if(this.form.valid){
      if(this.categoryId){
        this.updateCategory();
      }else{
        this.CreateCategory();
      }
    }else{
      this.form.markAllAsTouched();
    }
  }

  private CreateCategory(){
    const data=this.form.value;
    this.categoriesService.createCategory(data)
    .subscribe(rta=>{
      this.router.navigate(['./admin/categories']);
    });
  }
  private updateCategory(){
    const data=this.form.value;
    this.categoriesService.updateCategory(this.categoryId,data)
    .subscribe(rta=>{
      this.router.navigate(['./admin/categories']);
    });
  }
  private getCategory(){
    this.categoriesService.getCategory(this.categoryId)
    .subscribe(data=>{
      // puede ser asi
      this.form.patchValue(data);
      // o aasi
      // this.nameField.setValue(data.data);
    });
  }

  uploadFile(event){
    const image=event.target.files[0];
    const name = image.name;
    const imgRef = ref(this.storage,`imagenes/${name}`)
    const task = uploadBytes(imgRef,image);

    task
      .then(response => {
        this.getImage(name)
      })
      .catch(error => console.log(error))
  }


  getImage(nameImage:string) {
    const imgRef = ref(this.storage, 'imagenes')
    listAll(imgRef)
      .then( async rta => {
        const itemActual: StorageReference|undefined = rta.items.find(item => item.name === nameImage);
        if(itemActual){
          const url = await getDownloadURL(itemActual)
          this.imageField.setValue(url);
        }

      })
    }

}
