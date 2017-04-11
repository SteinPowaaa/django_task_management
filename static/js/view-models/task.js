function Task(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.status = ko.protectedObservable(data.status || "");
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

  self.commitAll = function () {
    self.status.commit();
  };

  self.normalize = function () {
    return {
      id: self.id,
      title: self.title(),
      description: self.description(),
      status: self.status(),
      priority: self.priority(),
      creator: self.creator,
      assignees: self.assignees().map(function (assigneeData) {
        return assigneeData.normalize();
      }),
      task_type: self.taskType(),
      project: self.project,
      ref_task: self.refTask ? self.refTask.normalize() : null,
      sprint: self.sprint() ? self.sprint() : null
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
      Arbiter.publish('task.created', data);
    });
  };

  self.updateSprint = function (sprint) {
    var data = self.normalize();
    data.sprint = sprint && sprint.id;

    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'PUT',
      data: data
    }).then(function (data) {
      self.sprint(sprint.id);
    });
  };

  self.updateStatus = function (status) {
    var data = self.normalize();
    data.status = status;

    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project, self.id),
      type: 'PUT',
      data: data
    }).then(function (data) {
      debugger
      self.status(data.status);
    });
  };

  self.changeStatus = function (status) {
    self.updateStatus(status).then(function () {
      self.status(status);
    });
  };

  self.submit = function () {
    self.commitAll();
    if (self.id === '') {
      self.create();
    } else {
      self.update();
    }
  };

  self.taskTypes = [
    new nameValuePair('Story', 'story'),
    new nameValuePair('Bug', 'bug'),
    new nameValuePair('Improvement', 'improvement'),
    new nameValuePair('Sub Task', 'sub-task')
  ];

  self.statuses = [
    new nameValuePair('Todo', 'todo'),
    new nameValuePair('In Progress', 'in-progress'),
    new nameValuePair('Completed', 'completed')
  ];

  self.priorities = [
    new nameValuePair('Low', 'low'),
    new nameValuePair('Medium', 'medium'),
    new nameValuePair('High', 'high')
  ];

  self.init();
}
