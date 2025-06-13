import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter, map } from 'rxjs';

import { routes } from '../../../app.routes';

@Component({
  selector: 'app-navbar',
  imports: [ RouterLink],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {

  router = inject(Router)

  routes = routes.map( ruta => ({
    path: ruta.path!,
    title: `${ruta.title ?? 'Sin título en rutas'}`,
  })).filter( ruta => ruta.path !== '**' );

  // Observable para el título de la página actual
  // pageTitle$ = this.router.events.pipe(
  //   filter( event => event instanceof NavigationEnd ),
  //   map( event => event.url ),
  //   map( url =>
  //     routes.find( route => `/${route.path}` === url )?.title ?? 'Página sin título'
  //   )
  // )

  // Señal para el título de la página actual
  pageTitleSignal = toSignal(
    this.router.events.pipe(
      filter( event => event instanceof NavigationEnd ),
      map( event => event.url ),
      map( url =>
        routes.find( route => `/${route.path}` === url )?.title ?? 'Página sin título'
      )
    )
  )
}
