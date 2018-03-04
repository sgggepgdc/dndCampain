import { Component, OnInit, ViewChildren, ElementRef, QueryList, AfterViewInit, ViewChild, Input } from '@angular/core';
import { GridModelService } from '../../models/grid-model.service';
import { isNumber } from 'util';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})

export class GridComponent implements AfterViewInit {
  @ViewChild('addToken') addTokenElement: ElementRef;
  @ViewChild('gridElement') gridElement: ElementRef;
  private gridSize = {};
  private rows = [];
  private columns = [];
  private grid = [];
  private alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  private originNode;
  private newToken = {
    color: 'blue',
    hp: null,
    name: null
  };

  constructor(private gridModel: GridModelService) {
      this.gridModel.gridSize.subscribe(data => this.gridSize=data);
      this.rows = Array(this.gridSize['height'])
        .fill(null, 0,this.gridSize['height'])
        .map((x,i)=>i+1);
      
      for (let i = 0; i < this.gridSize['width']; i++) {
        this.columns.push(this.alphabet[i]);
      }

      var rows = this.rows;
      var columns = this.columns;
      var grid = this.grid;

      rows.forEach(function(row) {
        columns.forEach(function(column) {
            grid[column + row] = {
              active: false,
              color: 'blank',
              name: null,
              hp: null
            };
        });
      });
   }

  ngAfterViewInit() {
  }


  moveToken(e: any) {
    let targetNode = this.grid[e.nativeEvent.target.id];
    let originNode = this.grid[this.originNode.id];
    if (!targetNode.active) {
      targetNode.color = originNode.color;
      targetNode.active = true;
      targetNode.name = originNode.name;
      targetNode.hp = originNode.hp;
      originNode.color = 'blank';
      originNode.active = false;
      originNode.name = null;
      originNode.hp = null;
    }
  }

  isSelectedColor(color) {
    if (this.newToken.color === color) return 'option selected';
    return 'option';
  } 

  storeOrigin(e: any) {
    this.originNode = e.target;
  }

  addTokenToGrid() {
      var originNode = this.originNode;
      var grid = this.grid;
      if (grid[originNode.id].active) return false;
        grid[originNode.id].color = this.newToken.color;
        grid[originNode.id].active = true;
        grid[originNode.id].name = this.newToken.name;
        grid[originNode.id].hp = this.newToken.hp;

      this.addTokenElement.nativeElement.classList.remove('visible');
  }

  setColor(color) {
    this.newToken.color = color;
  }

  hideNewToken() {
    this.addTokenElement.nativeElement.classList.remove('visible');
  }

  createToken(e: any) {
    this.originNode = e.target;
    this.addTokenElement.nativeElement.classList.add('visible');
  }

  onRightClick(id) {
    let node = this.grid[id];
    node.name = null;
    node.hp = null;
    node.color = 'blank';
    return false
  }

  tokenColor(id) {
    return 'token ' + this.grid[id].color;  
  }
}
