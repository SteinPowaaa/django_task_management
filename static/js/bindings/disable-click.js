ko.bindingHandlers.disableClick = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function (e) {
      e.stopPropagation();
    });
  }
};
