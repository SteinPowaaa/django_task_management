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
        viewModel.clearData();
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
        viewModel.clearCredentials();
        $('.nav-form').hide();
        $('.logged-in').show();
        viewModel.init();
      });
    });
  }
};
