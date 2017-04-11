function User(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = ko.observable(data.id || "");
    self.username = ko.observable(data.username || "");
    self.password = ko.observable(data.password || "");
    self.email = ko.observable(data.email || "");
    self.avatar_thumbnail = ko.observable(data.avatar_thumbnail || null);

    self.loggedIn = ko.observable(false);
  };

  self.normalize = function () {
    return {
      id: self.id(),
      username: self.username(),
      password:  self.password(),
      email: self.email()
      // avatar_thumbnail: self.avatar_thumbnail()
    };
  };

  self.save = function (event) {
    var data = self.normalize();
    blob = event && event.target.result;
    data.avatar_thumbnail = blob || "";
    $.post(Urls().registerUrl, data).then(function (data) {
      Arbiter.publish('user.created', data);
      self.clear();
    });
  };

  self.create = function () {
    var reader = new FileReader();
    var file = document.getElementById('my-file-selector').files[0];

    if (file) {
      reader.readAsDataURL(file, 'UTF-8');
      reader.onload = self.save;
    } else {
      self.save();
    }
  };

  self.clear = function () {
    self.username("");
    self.email("");
    self.password("");
    self.loggedIn(false);
  };

  self.init();
}
