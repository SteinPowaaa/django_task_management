function User(data) {
  var self = this;

  self.init = function (data) {
    var data = data || {};

    self.id = ko.observable(data.id || "");
    self.username = ko.observable(data.username || "");
    self.password = ko.observable(data.password || "");
    self.email = ko.obserable(data.email || "");
  };

  self.normalize = function () {
    return {
      "id": self.id(),
      "username": self.username(),
      "password":  self.password(),
      "email": self.email()
    };
  };

  self.clear = function () {
    self.username("");
    self.email("");
    self.password("");
  };

  self.clearPassword = function () {
    self.password("");
  };
}
