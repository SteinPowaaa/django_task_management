function Sprint(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.project = ko.observable(data.project || "");
  };

  self.normalize = function () {
    return {
      id: self.id,
      title: self.title(),
      description: self.description(),
      project: self.project()
    };
  };

  self.update = function () {
    var data = self.normalize();

    return $.ajax({
      url: Urls().getSprintDetailUrl(self.project(), self.id),
      type: 'PUT',
      data: data
    });
  };

  self.delete = function () {
    debugger
    return $.ajax({
      url: Urls().getSprintDetailUrl(self.project(), self.id),
      type: 'DELETE'
    });
  };

  self.create = function () {
    var data = self.normalize();

    $.post(Urls().getSprintListUrl(self.project.id), data).then(function (data) {
      Arbiter.publish('sprint.created', data);
    });
  };

  self.submit = function () {
    if (self.id) {
      self.update();
    } else {
      self.create();
    }
  };

  self.init();
}
