import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TextService } from '../../../shared/text.service';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import { ViewProduct, ProdcharColor } from '../../../api/models';

@Component({
  selector: 'app-threedview',
  templateUrl: './threedview.component.html',
  styleUrls: ['./threedview.component.scss']
})
export class ThreedviewComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() public model: ViewProduct;
  @Input() public shape: number;
  @ViewChild('canvas') private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;

  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1100;

  public controls: OrbitControls;
  public isRendering = false;

  private boundingRadius: number;
  private cameraTarget: THREE.Vector3;
  private defaultColors: Array<ProdcharColor>;

  constructor(private text: TextService) {
    this.render = this.render.bind(this);
  }

  doRender() {
    setTimeout(() => {
      if (!this.model || this.model.elements.length === 0) {
        if (this.renderer) {
          this.renderer.clear();
        }
        return;
      }
      this.cameraTarget = new THREE.Vector3(0, 0, 0);
      this.createScene();
      this.createLight();
      this.createCamera();
      this.startRendering();
      this.addControls();

      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.camera.aspect = this.getAspectRatio();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      this.render();
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.doRender();
  }

  ngOnInit() {

  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  drawSphere() {
    let radius = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      if (radius === 0) {
        radius = Number(element.SHAPE_PARAM2) * 0.5;
      } else {
        radius += Number(element.SHAPE_PARAM2);
      }
      geometry = new THREE.SphereGeometry(radius, 30, 30);
      const opacity = 1 * Math.pow(0.5, this.model.elements.length - index);
      // console.log('opacity:', opacity);
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: opacity,
        depthWrite: true,
        depthTest: true
      });
      const mesh = new THREE.Mesh(geometry, materials);
      this.scene.add(mesh);
    }
    this.boundingRadius = radius;
  }

  drawVerticalRect() {
    let height = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      height += Number(element.SHAPE_PARAM2) * 0.5;
      geometry = new THREE.BoxGeometry(element.SHAPE_PARAM3, element.SHAPE_PARAM2, element.SHAPE_PARAM1);
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(0, height, 0);
      this.scene.add(mesh);
      height += Number(element.SHAPE_PARAM2) * 0.5;
    }
    this.boundingRadius = height;
    this.cameraTarget = new THREE.Vector3(0, height / 2, 0);
  }

  drawHorizontalRect() {
    let length = 0;
    let height = 0;
    let width = 0;
    for (let index = 0; index < this.model.elements.length; index++) {
      let geometry = null;
      const element = this.model.elements[index];
      if (length === 0) {
        height = element.SHAPE_PARAM1;
        width = element.SHAPE_PARAM3;
      }
      length += Number(element.SHAPE_PARAM2) * 0.5;
      geometry = new THREE.BoxGeometry(
        element.SHAPE_PARAM1,
        element.SHAPE_PARAM3,
        element.SHAPE_PARAM2
      );
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(0, 0, length);
      this.scene.add(mesh);
      length += Number(element.SHAPE_PARAM2) * 0.5;
    }
    this.boundingRadius = Math.max(length, width, height);
    this.cameraTarget = new THREE.Vector3(0, 0, length / 2);
  }

  drawBread() {
    let height = 0;
    let width = 0;
    let length = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      if (height === 0) {
        width = Number(element.SHAPE_PARAM1);
        height = Number(element.SHAPE_PARAM2);
        length = Number(element.SHAPE_PARAM3);
      } else {
        width += Number(element.SHAPE_PARAM2) * 2;
        height += Number(element.SHAPE_PARAM2) * 2;
        length += Number(element.SHAPE_PARAM2) * 2;
      }
      geometry = new THREE.BoxGeometry(
        width,
        height,
        length
      );
      const opacity = 1 * Math.pow(0.5, this.model.elements.length - index);
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: opacity,
        depthWrite: true,
        depthTest: true
        // , clippingPlanes: [
        //   new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0)
        // ]
        // , side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geometry, materials);
      this.scene.add(mesh);
    }
    this.boundingRadius = Math.max(width, height, length) / 2;
  }

  drawCylinderVertical() {
    let height = 0;
    let width = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      if (height === 0) {
        width = element.SHAPE_PARAM1;
      }
      height += Number(element.SHAPE_PARAM2) * 0.5;
      geometry = new THREE.CylinderGeometry(
        element.SHAPE_PARAM1,
        element.SHAPE_PARAM1,
        element.SHAPE_PARAM2,
        30
      );
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(0, height, 0);
      this.scene.add(mesh);
      height += Number(element.SHAPE_PARAM2) * 0.5;
    }
    this.boundingRadius = Math.max(height, width);
    this.cameraTarget = new THREE.Vector3(0, height / 2, 0);
  }

  drawCylinderHorizontal() {
    let length = 0;
    let height = 0;
    for (let index = 0; index < this.model.elements.length; index++) {
      let geometry = null;
      const element = this.model.elements[index];
      if (length === 0) {
        height = element.SHAPE_PARAM1;
      }
      length += Number(element.SHAPE_PARAM2) * 0.5;
      geometry = new THREE.CylinderGeometry(
        element.SHAPE_PARAM1,
        element.SHAPE_PARAM1,
        element.SHAPE_PARAM2,
        30
      );
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.rotateZ(Math.PI / 2.0);
      mesh.position.set(length, 0, 0);
      this.scene.add(mesh);
      length += Number(element.SHAPE_PARAM2) * 0.5;
    }
    this.boundingRadius = Math.max(height, length);
    this.cameraTarget = new THREE.Vector3(length / 2, 0, 0);
  }

  drawSymmetricCylinderHorizonal() {
    let radius = 0;
    let length = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      if (radius === 0) {
        radius = Number(element.SHAPE_PARAM2) * 0.5;
        length = Number(element.SHAPE_PARAM1);
      } else {
        radius += Number(element.SHAPE_PARAM2);
      }
      geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        element.SHAPE_PARAM1,
        30,
        30
      );
      const opacity = 1 * Math.pow(0.5, this.model.elements.length - index);
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: opacity,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.rotateX(Math.PI / 2);
      this.scene.add(mesh);
    }
    this.boundingRadius = Math.max(length, radius);
  }

  drawSymmetricCylinderVertical() {
    let radius = 0;
    let height = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      if (radius === 0) {
        radius = Number(element.SHAPE_PARAM2) * 0.5;
        height = Number(element.SHAPE_PARAM1);
      } else {
        radius += Number(element.SHAPE_PARAM2);
      }
      geometry = new THREE.CylinderGeometry(
        radius,
        radius,
        element.SHAPE_PARAM1,
        30,
        30
      );
      const opacity = 1 * Math.pow(0.5, this.model.elements.length - index);
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: opacity,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      this.scene.add(mesh);
    }
    this.boundingRadius = Math.max(height, radius);
  }

  drawSlab() {
    let height = 0;
    for (let index = this.model.elements.length; index > 0; index--) {
      let geometry = null;
      const element = this.model.elements[index - 1];
      height += Number(element.SHAPE_PARAM2) * 0.5;
      geometry = new THREE.BoxGeometry(
        50,
        element.SHAPE_PARAM2,
        50
      );
      let color = parseInt(this.defaultColors[index].CODE_HEXA.replace('#', '0x'), 16);
      if (element.prodcharColor) {
        color = parseInt(element.prodcharColor.CODE_HEXA.replace('#', '0x'), 16);
      }
      const materials = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: false,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.position.set(0, height, 0);
      this.scene.add(mesh);
      height += Number(element.SHAPE_PARAM2) * 0.5;
    }
    this.boundingRadius = Math.max(height, 50);
    this.cameraTarget = new THREE.Vector3(0, height / 2, 0);
  }

  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(150));

    switch (Number(this.shape)) {
      case this.text.shapeNames.BREAD:
        this.drawBread();
        break;
      case this.text.shapeNames.REC_LAY:
        this.drawHorizontalRect();
        break;
      case this.text.shapeNames.REC_STAND:
        this.drawVerticalRect();
        break;
      case this.text.shapeNames.SLAB:
        this.drawSlab();
        break;
      case this.text.shapeNames.SPHERE:
        this.drawSphere();
        break;
      case this.text.shapeNames.CON_CYL_LAY:
        this.drawSymmetricCylinderHorizonal();
        break;
      case this.text.shapeNames.CON_CYL_STAND:
        this.drawSymmetricCylinderVertical();
        break;
      case this.text.shapeNames.CYL_LAY:
        this.drawCylinderHorizontal();
        break;
      case this.text.shapeNames.CYL_STAND:
        this.drawCylinderVertical();
        break;
      default:
        break;
    }
  }

  private createLight() {
    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(0, 0, 100);
    this.scene.add(light);
  }

  private createCamera() {
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );

    // Set position and look at
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 100;
  }

  private getAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRendering() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.autoClear = true;
    // this.renderer.clippingPlanes = [plane];
    this.renderer.localClippingEnabled = true;

    const component: ThreedviewComponent = this;

    (function render() {
      // requestAnimationFrame(render);
      component.render();
    }());
  }

  public render() {
    const fov = this.camera.fov * (Math.PI / 180);
    const distanceFactor = Math.abs(this.getAspectRatio() * this.boundingRadius / Math.sin(fov / 2));
    // console.log('distance factor: ', distanceFactor);
    this.camera.zoom = 200 / distanceFactor;
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  public addControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.addEventListener('change', this.render);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.render();
  }

  /* LIFECYCLE */
  ngAfterViewInit() {
    this.defaultColors = JSON.parse(localStorage.getItem('colors'));
    // console.log(this.defaultColors);
    this.doRender();
  }


}
