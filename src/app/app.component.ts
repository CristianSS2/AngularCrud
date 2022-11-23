import { Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'AngularCrud';
  displayedColumns: string[] = ['productname', 'category', 'date', 'freshness', 'price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getALLProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
     width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val=='save'){
        this.getALLProducts();
      }
      })
    
}
getALLProducts(){
  this.api.getProduct()
  .subscribe({
    next:(res)=>{
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },
    error:(err)=>{
      alert("Error no se puede cargar ")
    } 
  })
}
editProduct(row : any ){
  this.dialog.open(DialogComponent, {
    width: '30%',
    data:row
  }).afterClosed().subscribe(val=>{
    if(val=='update'){
      this.getALLProducts();
    }
    })
  
}
deleteProduct(id:number){
  this.api.deleteProduct(id)
  .subscribe({
    next:(res)=>{
      alert("Producto eliminado")
      this.getALLProducts();
    },
    error:()=>{
      alert("Error no pudo eliminar el producto")
    }
  })
    

  }
  
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}
