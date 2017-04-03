function Sprint(data) {
  var self = this;

  self.init = function (data) {
    var data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.project = data.project || "";
  };

  self.normalize = function () {
    return {
      "id": self.id,
      "title": self.title(),
      "description": self.description(),
      "project": self.project()
    };
  };

  self.update = function () {
    var data = self.normalize();
    var url = Urls.getSprintDetailUrl(self.project.id, self.id);

    return $.ajax({
      url: url,
      type: 'PUT',
      data: data
    });
  };

  self.delete = function () {
    var url = Urls.getSprintDetailUrl(self.project.id, self.id);

    return $.ajax({
      url: url,
      type: 'DELETE'
    });
  };
}
