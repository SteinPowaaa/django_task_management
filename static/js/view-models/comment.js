function Comment(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = data.id || "";
    self.author = data.author || "";
    self.task = ko.observable(data.task || "");
    self.text = ko.observable(data.text || "");
  };

  self.normalize = function () {
    return {
      id: self.id,
      author: self.author,
      text: self.text(),
      task: self.task()
    };
  };

  self.delete = function (projectId, taskId) {
    return $.ajax({
      url: Urls().getCommentDetailUrl(projectId, taskId, self.id),
      type: 'DELETE'
    });
  };

  self.create = function (projectId, taskId) {
    var data = self.normalize();

    $.post(Urls().getCommentListUrl(projectId, taskId), data).then(function (data) {
      Arbiter.publish('comment.created', data);
    });
  };

  self.init();
}
