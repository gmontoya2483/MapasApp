import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        border-radius: 5px;
        position: fixed;
        width: 400px;
        z-index: 99999999;

      }
    `
  ]
})
export class ZoomRangeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel = 15;
  center: [number, number] = [-58.47286437670145, -34.60599471948705];



  constructor() { }

  ngOnInit(): void {

  }


  ngAfterViewInit(): void {

    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });


    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    this.mapa.on('zoomend', (ev) => {
      if (this.mapa.getZoom() > 19) {
        this.mapa.zoomTo(19);
      }
    });


    this.mapa.on ('moveend', (event) => {
      const { lng, lat } = this.mapa.getCenter();
      this.center = [ lng, lat];
    });

  }


  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('moveend', () => {});
  }



  zoomOut(): void{
    this.mapa.zoomOut();
  }

  zoomIn(): void {
    this.mapa.zoomIn();
  }

  zoomCambio(value: string): void {
    console.log(value);
    this.mapa.zoomTo( Number(value));
  }

}
