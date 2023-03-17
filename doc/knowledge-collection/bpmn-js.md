# bpmn-js
bpmn-js ist die opensource Variante des Camunda Modelers. Die Dokumentation ist nicht besonders umfangreich und basiert 
hauptsächlich auf Beispielen:
- [Dokumentation von bpmn-js](https://bpmn.io/toolkit/bpmn-js/walkthrough/)
- [Beispiel Repository](https://github.com/bpmn-io/bpmn-js-examples)
Die Modellierungskonzepte, die Verwendung und die Schnittstellen sind überwiegend gleich wie bei der Camunda Platform. 
Daher können Fragen und Probleme aus dieser Kategorie eher von der [Dokumentation der Camunda Plattform](https://docs.camunda.org/manual/latest/)
 gelöst werden.
 
 <span style="color:red">Achtung</span>: Die aktuelle Version ist mit der Camunda Plattform Version 7 kompatibel, in der 
 aktuellsten Version 8 der Plattform wurden einige Dinge fundamental geändert. Beim Googeln von Problemen und Fehlern muss 
 man daher stets darauf achten, für welche Version die Lösung geeignet ist.

 ## Properties Panel  
 Das Properties Panel ist eine Erweiterung von bpmn-js, die es ermöglicht, die Attribute von BPMN Elementen im Modeler 
 anzeigen und bearbeiten zu können. 
 
 ### Einbau
 Um das Properties Panel in bpmn-js zu integrieren, muss man einen Container auf der Website erstellen und die id des 
 Containers an bpmn-js übergeben. Zusätzlich müssen die zwei Properties Panel Module als zusätzliche Module übergeben werden.
 ````javascript

````
 
 ### Größe
 Das Properties Panel wird nie größer als sein Inhalt, d.h. es füllt insbesondere nicht den ihm durch die Größe seines 
 Containers zur Verfügung stehenden Platzes. Daher setzt man den Background des Containers am Besten auf die Hintergrundfarbe 
 des Properties Panels:
 ```css
{
    background: #f8f8f8
} 
```