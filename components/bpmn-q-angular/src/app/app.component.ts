import {Component, ViewEncapsulation} from '@angular/core';
import '../../../bpmn-q/public/app.js'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  title = 'bpmn-q-angular';
}
