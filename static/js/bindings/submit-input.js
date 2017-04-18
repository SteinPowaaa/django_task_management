ko.bindingHandlers.submitInput = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).on('keyup', function (e) {
      if (e.keyCode === 13){
        bindingContext.$data.createComment();
      }
    });
  }
};
