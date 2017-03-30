ko.bindingHandlers.iconPicker = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    var taskType = valueAccessor()();
    var icon = {'bug': 'fa fa-bug',
                'improvement': 'fa fa-bolt',
                'sub-task': 'fa fa-certificate',
                'story': 'fa fa-book'}[taskType];

    $(element).addClass(icon);
  }
};
