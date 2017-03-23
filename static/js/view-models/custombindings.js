ko.bindingHandlers.selectPicker = {
     init: function (element, valueAccessor, allBindingsAccessor) {
         if ($(element).is('select')) {
             if (ko.isObservable(valueAccessor())) {
                 if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                     // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                     ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                 } else {
                     // regular select and observable so call the default value binding
                     ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                 }
             }
             $(element).addClass('selectpicker').selectpicker();
         }
     },
     update: function (element, valueAccessor, allBindingsAccessor) {
         if ($(element).is('select')) {
             var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
             if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                 var options = selectPickerOptions.optionsArray,
                     optionsText = selectPickerOptions.optionsText,
                     optionsValue = selectPickerOptions.optionsValue,
                     optionsCaption = selectPickerOptions.optionsCaption,
                     isDisabled = selectPickerOptions.disabledCondition || false,
                     resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                 if (ko.utils.unwrapObservable(options).length > 0) {
                     // call the default Knockout options binding
                     ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                 }
                 if (isDisabled && resetOnDisabled) {
                     // the dropdown is disabled and we need to reset it to its first option
                     $(element).selectpicker('val', $(element).children('option:first').val());
                 }
                 $(element).prop('disabled', isDisabled);
             }
             if (ko.isObservable(valueAccessor())) {
                 if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                     // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                     ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                 } else {
                     // call the default Knockout value binding
                     ko.bindingHandlers.value.update(element, valueAccessor);
                 }
             }

             $(element).selectpicker('refresh');
         }
     }
};

ko.bindingHandlers.backgroundColorPicker = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    priority = valueAccessor()();
    var color = {'low': '#91c05b',
                 'medium': '#faaa7a',
                 'high': '#f76b6f'}[priority];

    $(element).css('background-color', color);
  }
};

ko.bindingHandlers.login = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function(e) {
      e.preventDefault();
      var data = {
        "username": viewModel.username(),
        "password": viewModel.password()
      };
      $.post(viewModel.loginUrl, data).then(function (data, _, xhr) {
        viewModel.clearData();

        $(".login-alert").html('<div class="alert alert-success">Successfully' +
                               ' logged-in</div>');
        setTimeout(function() {
          $(".alert").fadeTo(500, 0).slideUp(500, function(){
            $(this).remove();
          });
        }, 1000);

        viewModel.currentUser(data);

        $('.nav-form').hide();
        $('.logged-in').show();
        viewModel.init();
      });
    });
  }
};

ko.bindingHandlers.logout = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(element).click(function () {
      $.post(viewModel.logoutUrl).then(function () {
        $('.logged-in').hide();
        $('.nav-form').show();
      });
    });
  }
};

ko.bindingHandlers.getCurrent = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $(document).ready(function(){
      $.get(viewModel.currentUserUrl).then(function (data){
        viewModel.currentUser(data.details);
        $('.nav-form').hide();
        $('.logged-in').show();
        viewModel.init();
      });
    });
  }
};

ko.bindingHandlers.openModal = {
  init: function(element, valueAccessor, allBindings, viewModel,
                 bindingContext){
    $('.create-project').click(function () {
      $('#projectModal').modal('show');
    });

    $('.create-task').click(function () {
      $('#taskModal').modal('show');
    });

    $('.create-user').click(function () {
      $('#userModal').modal('show');
    });
  }
};
