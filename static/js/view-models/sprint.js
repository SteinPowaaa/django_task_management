function Sprint(data) {
  var self = this;

  self.init = function (data) {
    var data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.project = ko.observable(data.project || "");
  };

  self.normalize = function () {
    return {
      "id": self.id,
      "title": self.title(),
      "description": self.description(),
      "project": self.project()
    };
  };
}
