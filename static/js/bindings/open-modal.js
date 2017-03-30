ko.bindingHandlers.openModal = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function () {
      $('#' + valueAccessor() + 'Modal').modal('show');
    });
  }
};
