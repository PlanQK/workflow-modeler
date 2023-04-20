# General Extension Hints

## Customizing Providers
IF you want to extend a provider of bpmn-js, create your provider without inherting from the original bpmn-js provider. Just name your new provider and register it at the bpmn-js provider. Then override the methods you want to customize. Only inhire from the original provider if you want to remove something, the original provider does, like palette entries.

## Execution of cutomized provider methods
If you have create a custom provider which customizes a method of a bpmn-js provider, be aware that you do not have to call the original provider at the end of your method. bpmn-js will call the original provider method by itself if your extended method will not return a value. This is especially important if your provider inheries from the original provider because you want to stop the behaviour of the original provider. If your method will return a value in any case, other custom providers which extend the same method will not be called.