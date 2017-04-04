function PageViewModel() {
  var self = this;

  self.init = function () {
    self.users = ko.observableArray([]);
    self.currentUser = ko.observable();
    self.projects = new ProjectsViewModel();

    self.getCurrentUser();
  };

  // $('.nav-form').hide();
  // $('.logged-in').show();
  self.getCurrentUser = function () {
    $.get(Urls().currentUserUrl).then(function (data){
      self.currentUser(new User(data.details));
      self.currentUser().loggedIn(true);
      self.loadUsers();
      Arbiter.publish('loggedIn');
    });
  };

  self.createUser = function () {
    var data = self.currentUser().normalize();

    $.post(Urls.userListUrl, data).then(function (data) {
      self.users.push(new User(data));
    });

    self.currentUser().clear();
  };

  self.loadUsers = function () {
    return $.getJSON(Urls.userListUrl).then(self.populateUsers);
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
      self.currentUser().loggedIn(true);
      self.loadUsers();
      Arbiter.publish('loggedIn');
    });
  };

  // $('.logged-in').hide();
  // $('.nav-form').show();
  self.logout = function () {
    $.post(Urls.logoutUrl).then(function () {
      self.users([]);
      Arbiter.publish('loggedOut');
    });
  };

  self.init();
}
