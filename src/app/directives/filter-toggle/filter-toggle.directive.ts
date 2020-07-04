import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[filterToggle]'
})
export class FilterToggleDirective {

  constructor() { }
  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    let viewport = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (viewport < 992 && document.querySelector('.az-content-dashboard-three').classList.contains('filter-show')) {
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
      document.querySelector('.az-content-dashboard-three').classList.toggle('filter-mobile');
    }
    else if (viewport < 992) {
      document.querySelector('.az-content-dashboard-three').classList.toggle('filter-mobile');
    }
    else {
      document.querySelector('.az-content-dashboard-three').classList.toggle('filter-show');
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
    }
  }
}

@Directive({
  selector: '[filterClose]'
})
export class FilterCloseDirective {

  constructor() { }
  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    //document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
    if (document.querySelector('.az-content-dashboard-three').classList.contains('filter-show')) {
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
    }
    else if (document.querySelector('.az-content-dashboard-three').classList.contains('filter-mobile')) {
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
    }

  }
}

@Directive({
  selector: '[filterMobile]'
})
export class FilterMobileDirective {

  constructor() { }
  @HostListener('window:resize', ['$event'])
  filterTogglr($event: any) {
    $event.preventDefault();

    let deviceWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    if (document.querySelector('.az-content-dashboard-three').classList.contains('filter-show')) {
      if (deviceWidth < 992) {
        document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
      }
      else {
        document.querySelector('.az-content-dashboard-three').classList.add('filter-show');
      }
    }
    else if (deviceWidth < 992 && document.querySelector('.az-content-dashboard-three').classList.contains('filter-mobile')) {
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-show');
    }
    else {
      document.querySelector('.az-content-dashboard-three').classList.remove('filter-mobile');
    }
  }
}