ko.bindingHandlers.uploadFile = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).on('change', function () {
      var file = element.files[0];
      var data = new FormData();
      data.append(file.name, file);
      bindingContext.$parent.addAttachment(bindingContext.$data, data);
    });
  }
};
