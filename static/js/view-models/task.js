function Task(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.id = data.id || "";
    self.title = ko.protectedObservable(data.title || "");
    self.description = ko.protectedObservable(data.description || "");
    self.status = ko.protectedObservable(data.status || "");
    self.priority = ko.protectedObservable(data.priority || "");
    self.creator = data.creator || null;
    self.assignees = ko.protectedObservableArray((data.assignees || []).map(function (assigneeData) {
      return new User(assigneeData);
    }));
    self.taskType = ko.protectedObservable(data.task_type || "");
    self.project = ko.protectedObservable(data.project || "");
    self.refTask = ko.protectedObservable((data.refTask || []).map(function (task) {
      return new Task(task);
    }));
    self.sprint = ko.protectedObservable(data.sprint || null);
    self.comments = ko.observableArray([]);

    self.commentToggle = ko.observable(false);
    self.commentForEdit = ko.observable();

    Arbiter.subscribe('comment.created', self.addComment);

    self.load();
  };

  self.load = function () {
    self.loadComments();
  };

  self.loadComments = function () {
    $.getJSON(Urls().getCommentListUrl(self.project(), self.id))
      .then(self.populateComments);
  };

  self.populateComments = function (data) {
    var comments = data.map(function (commentData) {
      return new Comment(commentData);
    });

    self.comments(comments);
  };

  self.addAttachment = function (comment, data) {
    comment.addAttachment(data, self.project(), self.id);
  };

  self.toggleComment = function () {
    self.commentToggle(!self.commentToggle());
  };

  self.createComment = function () {
    self.commentForEdit().create(self.project(), self.id);
  };

  self.newComment = function () {
    self.commentForEdit(new Comment());
    self.commentForEdit().task(self.id);
  };

  self.removeComment = function (comment) {
    comment.delete(self.project, self.id).then(function () {
      self.comments.remove(comment);
    });
  };

  self.addComment = function (data) {
    if (data.task === self.id) {
      self.comments.push(new Comment(data));
    }
  };

  self.commitAll = function () {
    self.title.commit();
    self.description.commit();
    self.priority.commit();
    self.taskType.commit();
    self.project.commit();
    self.refTask.commit();
    self.sprint.commit();
    self.status.commit();
    self.assignees.commit();
  };

  self.resetAll = function () {
    self.title.reset();
    self.description.reset();
    self.priority.reset();
    self.taskType.reset();
    self.project.reset();
    self.refTask.reset();
    self.sprint.reset();
    self.status.reset();
    self.assignees.reset();
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
        return assigneeData.id();
      }),
      task_type: self.taskType(),
      project: self.project(),
      ref_task: self.refTask(),
      sprint: self.sprint()
    };
  };

  self.delete = function () {
    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project(), self.id),
      type: 'DELETE'
    });
  };

  self.update = function () {
    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project(), self.id),
      type: 'PUT',
      data: self.normalize()
    });
  };

  self.create = function () {
    var data = self.normalize();

    $.ajax({
      type: "POST",
      url: Urls().getTaskListUrl(self.project()),
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json"
    }).then(function (data) {
      Arbiter.publish('task.created', data);
    });
  };

  self.updateSprint = function (sprint) {
    var data = self.normalize();
    data.sprint = sprint && sprint.id;

    return $.ajax({
      url: Urls().getTaskDetailUrl(self.project(), self.id),
      type: 'PUT',
      data: data
    }).then(function (data) {
      self.sprint(data.sprint);
      self.sprint.commit();
    });
  };

  self.updateStatus = function (status) {
    var data = {
      'status': status
    };

    return $.ajax({
      url: Urls().getTaskChangeStatusUrl(self.project(), self.id),
      type: 'PUT',
      data: data
    });
  };

  self.changeStatus = function (status) {
    self.updateStatus(status).then(function (data) {
      self.status(data);
      self.status.commit();
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

  self.taskTypes = ko.observableArray([
    new nameValuePair('Story', 'story'),
    new nameValuePair('Bug', 'bug'),
    new nameValuePair('Improvement', 'improvement'),
    new nameValuePair('Sub Task', 'sub-task')
  ]);

  self.statuses = ko.observableArray([
    new nameValuePair('Todo', 'todo'),
    new nameValuePair('In Progress', 'in-progress'),
    new nameValuePair('Completed', 'completed')
  ]);

  self.priorities = ko.observableArray([
    new nameValuePair('Low', 'low'),
    new nameValuePair('Medium', 'medium'),
    new nameValuePair('High', 'high')
  ]);

  self.init();
}
