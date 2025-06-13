import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { v4 as UUIDv4 } from 'uuid';

interface Marker {
  id: string;
  mapboxMarker: maplibregl.Marker;
}


@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',

})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('mapa')
  mapSignal = signal<maplibregl.Map | null >(null)

  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if( !this.divElement()?.nativeElement) return

    await new Promise(resolve => setTimeout(resolve, 100));
    const element = this.divElement()!.nativeElement;

    const map = new maplibregl.Map({
      container: element,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [-6.419388, 38.425306],
      zoom: 16
    });

    this.mapListeners(map);
  }

  mapListeners(map: maplibregl.Map) {

    map.on('click', event => this.mapClick(event) );

    this.mapSignal.set(map);
  }

  mapClick( event: maplibregl.MapMouseEvent) {
    if( !this.mapSignal()) return

    const map = this.mapSignal()!
    const coords = event.lngLat;

    const colorRand = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const mapBoxMarker = new maplibregl.Marker({
      draggable: false,
      color: colorRand,
    }).setLngLat(coords).addTo(map)

    // Instalamos uuid para el marcador => npm i uuid
    const newMarker: Marker = {
      id: UUIDv4(),
      mapboxMarker: mapBoxMarker
    }

    this.markers.update(actualMarkers => [newMarker, ...actualMarkers] )

    console.log('Marcadores: ', this.markers());
  }

  flyToMarker(lnglat: maplibregl.LngLat) {
    if( !this.mapSignal()) return

    this.mapSignal()!.flyTo({
      center: lnglat,
      zoom: 16,
      essential: true // this animation is considered essential with respect to prefers-reduced-motion
    })
  }

  deleteMarker(marker: Marker) {
    if( !this.mapSignal()) return

    const map = this.mapSignal()!;
    marker.mapboxMarker.remove();
    this.markers.update(actualMarkers => actualMarkers.filter(markTap => markTap.id !== marker.id) );

  }
}
