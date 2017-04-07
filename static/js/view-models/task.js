function Task(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.status = ko.observable(data.status || "");
    self.priority = ko.observable(data.priority || "");
    self.creator = data.creator || null;
    self.assignees = ko.observableArray((data.assignees || []).map(function (assigneeData) {
      return new User(assigneeData);
    }));
    self.taskType = ko.observable(data.task_type || "");
    self.project = data.project || "";
    self.refTask = data.ref_task ? new Task(data.ref_task) : null;
    self.sprint = ko.observable(data.sprint || null);
  };

  self.normalize = function () {
    return {
      id: self.id,
      title: self.title(),
      description: self.description(),
      status: self.status(),
      priority: self.priority(),
      creator: self.creator.id,
      assignees: self.assignees().map(function (assigneeData) {
        return assigneeData.normalize();
      }),
      task_type: self.taskType(),
      project: self.project,
      ref_task: self.refTask ? self.refTask.normalize() : null,
      sprint: self.sprint ? self.sprint().normalize() : null
    };
  };

  self.delete = function () {
    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'DELETE'
    });
  };

  self.update = function () {
    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'PUT',
      data: self.normalize()
    });
  };

  self.create = function () {
    var data = self.normalize();

    $.post(Urls().getTaskListUrl(self.project), data).then(function (data) {
      Arbited.publish('task.created', data);
    });
  };

  self.updateSprint = function (sprint) {
    var data = {
      sprint: sprint && sprint.normalize()
    };

    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'PATCH',
      data: data
    });
  };

  self.updateStatus = function (status) {
    var data = {
      "status": status
    };

    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'PATCH',
      data: data
    });
  };

  self.changeStatus = function (status) {
    self.updateStatus(status).then(function () {
      self.status(status);
    });
  };

  self.taskTypes = ko.observableArray([
    new nameValuePair('story', 'Story'),
    new nameValuePair('bug', 'Bug'),
    new nameValuePair('improvement', 'Improvement'),
    new nameValuePair('sub-task', 'Sub Task')
  ]);

  self.statuses = ko.observableArray([
    new nameValuePair('todo', 'Todo'),
    new nameValuePair('in-progress', 'In Progress'),
    new nameValuePair('completed', 'Completed')
  ]);

  self.priorities = ko.observableArray([
    new nameValuePair('low', 'Low'),
    new nameValuePair('medium', 'Medium'),
    new nameValuePair('high', 'High')
  ]);

  self.init();
}
