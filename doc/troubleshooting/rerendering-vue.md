# Rerendering the DOM in Vue
Vue only renders the DOM if it recognizes a change.
The proplem is that the quantum workflow modeler is imported
as a bundled HTML Web Component.
In the Vue Setup the Modeler does not update when 
a new file is created by using the little pop-up on a selected 
element. The reason for that might be the re-rendering of Vue which 
gets problems with imported composite components.

https://www.telerik.com/blogs/understanding-vuejs-nexttick

https://stackoverflow.com/questions/49354607/vue-js-data-is-not-updating-with-state-change-so-the-re-render-does-not-happen

https://michaelnthiessen.com/debugging-guide-why-your-component-isnt-updating/

https://stackoverflow.com/questions/32106155/can-you-force-vue-js-to-reload-re-render

https://michaelnthiessen.com/force-re-render/

https://vuejsdevelopers.com/2019/01/22/vue-what-is-next-tick/