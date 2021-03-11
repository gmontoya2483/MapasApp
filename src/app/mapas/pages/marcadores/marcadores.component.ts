import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';



interface MarcadorConColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
      }

      .list-group-item {
        cursor: pointer;
      }
    `
  ]
})
export class MarcadoresComponent implements OnInit, AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoomLevel = 15;
  center: [number, number] = [-58.47286437670145, -34.60599471948705];

  // Arreglo de marcadores

  marcadores: MarcadorConColor[] = [];

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

    this.leerMarcadoresLocalStorage();



    // const markerHtml: HTMLElement = document.createElement('div');
    // markerHtml.innerHTML = 'Hola Mundo';
    // const marker = new mapboxgl.Marker({
    //   element: markerHtml
    // })
    //   .setLngLat( this.center )
    //   .addTo(this.mapa);

    // const marker = new mapboxgl.Marker()
    //   .setLngLat( this.center )
    //   .addTo(this.mapa);

  }

  irMarcador(marker: mapboxgl.Marker): void {
    this.mapa.flyTo({
      center: marker.getLngLat()
    });

  }

  agregarMarcador(): void {

    // tslint:disable-next-line:no-bitwise
    const color = '#xxxxxx'.replace(/x/g, y => ( Math.random() * 16 | 0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
      .setLngLat( this.center )
      .addTo(this.mapa);



    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });

    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', (ev ) => {
      this.guardarMarcadoresLocalStorage();
    });


  }


  guardarMarcadoresLocalStorage(): void {

    const lngLatArr: MarcadorConColor[] = [];

    this.marcadores.forEach(m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

  }

  leerMarcadoresLocalStorage(): void {

    if ( !localStorage.getItem('marcadores')){
      return;
    }

    const lngLatArr: MarcadorConColor [] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {



      const newMarker = new mapboxgl.Marker({
        draggable: true,
        color: m.color
      })
        .setLngLat( m.centro! )
        .addTo(this.mapa);



      this.marcadores.push({
        color: m.color,
        marker: newMarker
      });


      newMarker.on('dragend', (ev) => {
        this.guardarMarcadoresLocalStorage();
      });



    });

  }

  borrarMarcador(i: number): void {
    this.marcadores[i].marker?.remove();
    this.marcadores.splice(i, 1);
    this.guardarMarcadoresLocalStorage();
  }
}
