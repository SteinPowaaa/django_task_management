function PageViewModel() {
  var self = this;

  self.init = function () {
    self.users = ko.observableArray([]);
    self.currentUser = ko.observable(new User());
    self.projects = new ProjectsViewModel();

    self.menuToggled = ko.observable(false);
    self.managerToggled = ko.observable(false);

    Arbiter.subscribe('user.created', self.addUser);

    self.getCurrentUser();
    self.loadUsers();
  };

  // $('.nav-form').hide();
  // $('.logged-in').show();
  self.getCurrentUser = function () {
    $.get(Urls().currentUserUrl).then(function (data){
      self.setUserLoadData(data);
    });
  };

  self.addUser = function (data) {
    self.users.push(new User(data));
  };

  self.loadUsers = function () {
    return $.getJSON(Urls().userListUrl).then(self.populateUsers);
  };

  self.populateUsers = function (data) {
    var users = data.map(function (userData) {
      return new User(userData);
    });
    self.users(users);
  };

  self.toggleMenu = function () {
    self.menuToggled(!self.menuToggled());
  };

  self.toggleManager = function () {
    self.managerToggled(!self.managerToggled());
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
    $.post(Urls().loginUrl, self.currentUser().normalize()).then(function (data) {
      self.setUserLoadData(data);
    });
  };

  // $('.logged-in').hide();
  // $('.nav-form').show();
  self.logout = function () {
    $.post(Urls().logoutUrl).then(function () {
      self.currentUser().clear();
      self.users([]);
      Arbiter.publish('loggedOut');
    });
  };

  self.setUserLoadData = function (data) {
    self.currentUser(new User(data.details));
    self.currentUser().loggedIn(true);
    self.loadUsers();
    Arbiter.publish('loggedIn');
  };

  self.init();
}
