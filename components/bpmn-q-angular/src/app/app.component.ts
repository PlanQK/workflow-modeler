import {Component, ViewEncapsulation} from '@angular/core';
// import '@planqk/quantum-workflow-modeler/public/app.js';
import '../../../bpmn-q/dist/index.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'bpmn-q-angular';
}
