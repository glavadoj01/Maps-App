import { DecimalPipe, JsonPipe } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';


@Component({
  selector: 'app-fullscreen-map-page',
  imports: [JsonPipe, DecimalPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles: `
    div {
      width: 100vw;
      height: calc(100vh - 64px);
      background-color: wheat;
    }
    #controls {
      flex: 0 0 auto;
      padding: 10px;
      background: white;
      border-radius: 5px;
      position: fixed;
      bottom: 40px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('mapa')
  mapSignal = signal<maplibregl.Map | null >(null)
  zoom = signal(6); // starting zoom
  coordinates = signal({ lng: -5, lat: 40 });

  zoomEffect = effect( () => {
    if (!this.mapSignal()) return

    this.mapSignal()!.zoomTo(this.zoom());
  })

  async ngAfterViewInit() {
    if( !this.divElement()?.nativeElement) return

    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for the view to be initialized
    const element = this.divElement()!.nativeElement;
    const {lng, lat} = this.coordinates();

    const map = new maplibregl.Map({
      container: element, // container id
      style: 'https://demotiles.maplibre.org/style.json', // style URL
      center: [lng, lat],
      zoom: this.zoom()
    });

    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {
    // Para que el componente zoom se actualice aún con el cambio mediante ratón/teclado
    // Si no solo estaría asociado al cambio mediante el componente deslizante
    map.on('zoom', event => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    })

    map.on('moveend', event => {
      const center = map.getCenter();
      this.coordinates.set(center);
      console.log('Coordinates updated:', center);
    })

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    this.mapSignal.set(map);
  }
}
