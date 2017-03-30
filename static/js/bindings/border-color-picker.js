ko.bindingHandlers.borderColorPicker = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    var priority = valueAccessor()();
    var color = {'low': 'tsk-low-priority',
                 'medium': 'tsk-medium-priority',
                 'high': 'tsk-high-priority'}[priority];

    $(element).addClass(color);
  }
};
