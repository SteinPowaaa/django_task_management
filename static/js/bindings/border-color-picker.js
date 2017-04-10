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

ko.bindingHandlers.disableClick = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function (e) {
      e.stopPropagation();
    });
  }
};
