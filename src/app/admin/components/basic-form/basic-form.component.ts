import { Component, OnInit } from '@angular/core';
import { FormControl,Validators,FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-basic-form',
  templateUrl: './basic-form.component.html',
  styleUrls: ['./basic-form.component.scss']
})
export class BasicFormComponent implements OnInit{
  constructor(
    private formBuilder:FormBuilder
  ){
    this.buildForm();
  }
  // form control individuales
  // nameField=new  FormControl('',[Validators.required,Validators.maxLength(10)]);
  // emailField=new FormControl('');
  // phoneField=new FormControl('');
  // colorField=new FormControl('#213b87');
  // dateField=new FormControl('');
  // numberField=new FormControl('12');

  // categoryField=new FormControl('category-3');
  // tagField=new FormControl('');

  // agreeField=new FormControl(false);
  // genderField=new FormControl('');
  // zoneField=new FormControl('');

  form:FormGroup;

  ngOnInit(): void {
    this.nameField.valueChanges
    .subscribe(value=>{
      console.log(value);
    })
    this.form.valueChanges
    .subscribe(value=>{
      console.log(value);
    });
  }

  getNameValue(){
    console.log(this.nameField.value);
  }

  save(event){
    if(this.form.valid){
      console.log(this.form.value);
    }else{
      this.form.markAllAsTouched();
    }
  }

  private buildForm(){
    this.form= this.formBuilder.group({
      name:['',[Validators.required,Validators.maxLength(10)]],
      email:[''],
      phone:['',Validators.required],
      color:['#213b87'],
      date:[''],
      number:['12'],
      category:['category-3'],
      tag:[''],
      agree:[false],
      gender:[''],
      zone:['']
    });

  }

  get nameField(){
    return this.form.get('name');
  }
  get emailField(){
    return this.form.get('email');
  }
  get phoneField(){
    return this.form.get('phone');
  }
  get colorField(){
    return this.form.get('color');
  }
  get dateField(){
    return this.form.get('date');
  }
  get numberField(){
    return this.form.get('number');
  }
  get categoryField(){
    return this.form.get('category');
  }
  get tagField(){
    return this.form.get('tag');
  }
  get agreeField(){
    return this.form.get('agree');
  }
  get genderField(){
    return this.form.get('gender');
  }
  get zoneField(){
    return this.form.get('zone');
  }

  get isNameFieldValid(){
    return this.nameField.touched && this.nameField.valid;
  }

  get isNameFieldInValid(){
    return this.nameField.touched && this.nameField.invalid;
  }
  
}
