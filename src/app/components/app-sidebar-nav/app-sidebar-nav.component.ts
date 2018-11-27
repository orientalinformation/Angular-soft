import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AppSysUtilzComponent } from '../app-sys-utilz/app-sys-utilz.component';
import { Study, ViewProduct } from '../../api/models';
import { OverviewComponent } from '../../shared/overview/overview.component';
import { BsModalRef } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { ApiService } from '../../api/services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav">
      <ul class="nav">
        <li class="nav-title">
          {{'Navigation'|translate}}
        </li>
        <li class="nav-title" *ngIf="checkChaining()" >
          <a href="javascript:void(0);" (click)="onShowOverviewChaining()">
            <i class="fa fa-link"></i> {{' Chaining Overview'|translate}}
          </a>
        </li>
        <ng-template ngFor let-navitem [ngForOf]="navigation">
          <li *ngIf="isDivider(navitem)" class="nav-divider"></li>
          <ng-template [ngIf]="isTitle(navitem)">
            <app-sidebar-nav-title [title]='navitem'></app-sidebar-nav-title>
          </ng-template>
          <ng-template [ngIf]="!isDivider(navitem)&&!isTitle(navitem)">
            <app-sidebar-nav-item [item]='navitem'></app-sidebar-nav-item>
          </ng-template>
        </ng-template>
        <li class="app-sys-utilz"><app-sys-utilz></app-sys-utilz></li>
      </ul>
    </nav>
    `,
  styles: [`
    .app-sys-utilz {
      position: absolute;
      bottom: 20px;
    }
    @media (max-width: 991px){
      .app-sys-utilz {
        position: static;
      }
    }
    @media (min-width: 576px) {
      .modal-dialog {
        max-width: 900px;
        margin: 30px auto;
      }
    }
  `]
})
export class AppSidebarNavComponent implements OnInit {
  bsModalRef: BsModalRef;
  @Input() public navigation: any = [];
  public study: Study = null;

  public isDivider(item) {
    return item.divider ? true : false;
  }

  public isTitle(item) {
    return item.title ? true : false;
  }

  public checkChaining() {
    let ischain = false;
    if (this.study) {
      if (Number(this.study.CHAINING_CONTROLS) === 1) {
        ischain = true;
      } else {
        ischain = false;
      }
    }

    return ischain;
  }

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  onShowOverviewChaining() {
    this.bsModalRef = this.modalService.show(OverviewComponent, { class: 'modal-lg' });
  }
}

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})
export class AppSidebarNavItemComponent {
  @Input() item: any;

  public hasClass() {
    return this.item.class ? true : false;
  }

  public isDropdown() {
    return this.item.children ? true : false;
  }

  public thisUrl() {
    return this.item.url;
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), false);
  }

  constructor( private router: Router )  { }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      routerLinkActive="active"
      [routerLink]="[link.url]">
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false;
  }

  public isBadge() {
    return this.link.badge ? true : false;
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false;
  }

  public isIcon() {
    return this.link.icon ? true : false;
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle href="#" (click)="closeAndOpenStudy()">
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item [item]='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent implements OnInit {
  @Input() link: any;
  public study: Study = null;

  public isBadge() {
    return this.link.badge ? true : false;
  }

  public isIcon() {
    return this.link.icon ? true : false;
  }

  constructor(private api: ApiService, private router: Router, private translate: TranslateService) { }

  ngOnInit() {
    if (localStorage.getItem('study')) {
      this.study = JSON.parse(localStorage.getItem('study'));
    }
  }

  closeAndOpenStudy() {
    if (this.study && Number(this.study.ID_STUDY) !== Number(this.link.id)) {
      swal({
        title: this.translate.instant('Are you sure?'),
        text: this.translate.instant('Close study current and open study ' + this.link.name
          + '. Do you still want to open study?'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.value) {
          localStorage.removeItem('study');
          localStorage.removeItem('meshView');
          localStorage.removeItem('productShape');
          localStorage.removeItem('productView');

          this.router.navigate(['/loading']);

          this.api.getStudyById(this.link.id).subscribe(
            (resp: Study) => {
              localStorage.setItem('study', JSON.stringify(resp));
              this.api.openStudy(resp.ID_STUDY).subscribe(
                  data => {
                    this.api.getProductViewModel(resp.ID_PROD).subscribe(
                      (response: ViewProduct) => {
                        localStorage.setItem('productView', JSON.stringify(response));
                        const elements = response.elements;
                        if (elements.length > 0) {
                          localStorage.setItem('productShape', elements[0].ID_SHAPE.toString());
                        } else {
                          localStorage.removeItem('productShape');
                        }
                      },
                      err => {
                        // console.log(err);
                      },
                      () => {
                        this.router.navigate(['/input']);
                      }
                    );
                  },
                  err => {
                    // console.log(err);
                  },
                  () => {
                  }
                );
            },
            (err) => {
              // console.log(err);
            },
            () => {

            }
          );
        }
      });
    }
  }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if ( this.title.class ) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if ( this.title.wrapper ) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li);
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
