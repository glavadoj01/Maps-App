import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styles: `
    div {
      width: 100%;
      height: 260px;
      background-color: wheat;
    }
  `
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('mapa')
  lngLat = input.required<{lng: number, lat: number}>()
  zoom = input<number>(14);

  async ngAfterViewInit() {
    if( !this.divElement()?.nativeElement) return

    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the view to be initialized
    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element, // container id
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: this.lngLat(),
      zoom: this.zoom(), // Opcional: Def. 14
      interactive: false,
      pitch: 30,
    });

    new maplibregl.Marker().setLngLat(this.lngLat()).addTo(map);
  }

}
