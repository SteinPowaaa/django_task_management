function TaskViewModel(data, user) {
  var self = this;

  self.init = function () {
    var data = data || {};

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
    self.status = ko.observable(data.status || "");
    self.priority = ko.observable(data.priority || "");
    self.creator = data.creator ? new User(data.creator) : null;
    self.assignees = ko.observableArray((data.assignees || []).map(function (assigneeData) {
      return new User(assigneeData);
    }));
    self.taskType = ko.observable(data.task_type || "");
    self.project = data.project || "";
    self.refTask = data.ref_task ? new TaskViewModel(data.ref_task) : null;
    self.sprint = ko.observable(data.sprint || null);
  };

  self.normalize = function () {
    return {
      "id": self.id,
      "title": self.title(),
      "description": self.description(),
      "status": self.status(),
      "priority": self.priority(),
      "creator": self.creator.id,
      "assignees": self.assignees(),
      "task_type": self.taskType(),
      "project": self.project,
      "ref_task": self.refTask ? self.refTask.normalize() : null,
      "sprint": self.sprint()
    };
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
}
