import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})
export class PipelineComponent implements OnInit {
  public pipelineType: number;
  public activePagePipeline = '';
  constructor() {
    this.pipelineType = 1;
   }

  ngOnInit() {
    this.activePagePipeline = 'new';
  }

  openNewPipeline() {
    const pgNew = <HTMLElement>document.getElementById('page-new-pipeline'); 
    const pgLoad = <HTMLElement>document.getElementById('page-load-pipeline');
    pgNew.style.display = 'block';
    pgLoad.style.display = 'none';
    this.activePagePipeline = 'new';
  }

  openLoadPipeline() {
    const pgNew = <HTMLElement>document.getElementById('page-new-pipeline'); 
    const pgLoad = <HTMLElement>document.getElementById('page-load-pipeline');
    pgNew.style.display = 'none';
    pgLoad.style.display = 'block';
    this.activePagePipeline = 'load';
  }

  changeTypePipeline() {
    const pgPipe = <HTMLElement>document.getElementById('page-type-pipeline');
    const pgStorage = <HTMLElement>document.getElementById('page-type-storagetank');
    const pgTee = <HTMLElement>document.getElementById('page-type-tee');
    pgPipe.style.display = 'none';
    pgStorage.style.display = 'none';
    pgTee.style.display = 'none';
    if(this.pipelineType == 2){
      pgStorage.style.display = 'block';
    }else if(this.pipelineType == 1){
      pgPipe.style.display = 'block';
    }else{
      pgTee.style.display = 'block';
    }
  }

}
