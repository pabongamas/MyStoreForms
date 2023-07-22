import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { Storage, ref, uploadBytes, listAll, getDownloadURL, StorageReference } from '@angular/fire/storage';
import {MyValidators} from './../../../../utils/validators'
import {FormControl,Validators,FormBuilder, FormGroup} from '@angular/forms';
import {Category} from './../../../../core/models/category.model'
import {CategoriesService} from './../../../../core/services/categories.service';
@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  isNew=true;
  form:FormGroup;
  @Input()
  set category(data:Category){
    if(data){
      this.isNew=false;
      this.form.patchValue(data);
    }
  }
  @Output() create=new EventEmitter();
  @Output() update=new EventEmitter();
  categoryId:string;

  constructor(
    private formBuilder:FormBuilder,
    private storage: Storage,
  ) { 
    this.buildForm();
  }

  ngOnInit(): void {
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
      if(this.isNew){
        this.create.emit(this.form.value);
        // this.CreateCategory();
      }else{
        this.update.emit(this.form.value);
        // this.updateCategory();
      }
    }else{
      this.form.markAllAsTouched();
    }
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
