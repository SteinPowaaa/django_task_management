function PageViewModel() {
  var self = this;

  self.init = function () {
    self.users = ko.observableArray([]);
    self.currentUser = ko.observable();
    self.userForEdit = ko.observable();

    self.getCurrentUser();
  };

  // $('.nav-form').hide();
  // $('.logged-in').show();
  self.getCurrentUser = function () {
    $.get(viewModel.currentUserUrl).then(function (data){
      self.currentUser(new User(data));
      self.loadUsers();
      // load projects
    });
  };

  self.createUser = function () {
    var data = self.userForEdit().normalize();

    $.post(Urls.userListUrl, data).then(function (data) {
      self.users.push(new User(data));
    });

    self.userForEdit().clear();
  };

  self.loadUsers = function () {
    return $.getJSON(Url.userListUrl).then(self.populateUsers);
  };

  self.populateUsers = function (data) {
    var users = data.map(function (userData) {
      return new User(userData);
    });
    self.users(users);
  };

  self.toggleMenu = function () {
    self._toggleMenu(!self._toggleMenu());
  };

  self.toggleManager = function () {
    self._toggleManager(!self._toggleManager());
  };

  // $(".login-alert").html('<div class="alert alert-success">Successfully' +
  //                              ' logged-in</div>');
  //       setTimeout(function() {
  //         $(".alert").fadeTo(500, 0).slideUp(500, function(){
  //           $(this).remove();
  //         });
  //       }, 1000);

  //       $('.nav-form').hide();
  //       $('.logged-in').show();

  self.login = function () {
    $.post(Urls.loginUrl, self.currentUser().normalize()).then(function (data) {
      // login=true
      // projects.load
      self.loadUsers();
    });
  };

  // $('.logged-in').hide();
  // $('.nav-form').show();
  self.logout = function () {
    $.post(Urls.logoutUrl).then(function () {
      // projects.clear();
      self.users([]);
    });
  };

  self.init();
}
