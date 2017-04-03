function Project(data) {
  var self = this;

  self.init = function (data) {
    var data = data || {};

    self.dataLoaded = ko.observable(false);

    self.sprints = ko.observableArray([]);
    self.tasks = ko.observableArray([]);

    self.currentSprint = ko.observable();

    self.sprintForEdit = ko.observable();
    self.taskForEdit = ko.observable();

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");
  };

  self.load = function () {
    if (self.dataLoaded()){
      return;
    }

    self.loadTasks();
    self.loadSprints();
    self.dataLoaded(true);
  };

  self.loadTasks = function () {
    $.getJSON(Urls.getTaskListUrl(self.id)).then(self.populateTasks);
  };

  self.populateTasks = function (data) {
    var tasks = data.map(function (taskData) {
      return new Task(taskData);
    });

    self.tasks(tasks);
  };

  self.loadSprints = function () {
    $.getJSON(self.sprintsUrl())
      .then(self.populateSprints)
      .then(self.populateDefaultSprint);
  };

  self.populateSprints = function (data) {
    var sprints = data.map(function (sprintData) {
      return new Sprint(sprintData);
    });

    self.sprints(sprints);
  };

  self.populateDefaultSprint = function () {
    self.currentSprint(self.sprints()[0]);
  };

  self.update = function () {
    var data = self.normalize();
    var url = Urls.getProjectDetailUrl(self.id);

    return $.ajax({
      url: url,
      type: 'PUT',
      data: data
    });
  };

  self.delete = function (project) {
    var url = getProjectDetailUrl(project.id);

    return $.ajax({
      url: url,
      type: 'DELETE'
    });
  };

  self.normalize = function () {
    return {
      "id": self.id,
      "title": self.title(),
      "description": self.description()
    };
  };

  self.editSprint = function(sprint){
    self.sprintForEdit(sprint);
  };

  self.newSprint = function (sprint) {
    self.sprintForEdit(new Sprint());
  };

  self.editTask = function (task) {
    self.taskForEdit(task);
  };

  self.newTask = function (task) {
    self.taskForEdit(new Task());
  };

  self.selectSprint = function (sprint) {
    self.currentSprint(sprint);
  };

  self.addTaskToSprint = function (task) {
    task.updateSprint(self.currentSprint());
  };

  self.removeTaskFromSprint = function (task) {
    task.updateSprint(null);
  };

  self.taskTodo = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'todo';
    });
  });

  self.tasksInProgress = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'in-progress';
    });
  });

  self.tasksCompleted = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.status() === 'completed';
    });
  });

  self.filterStory = ko.computed(function () {
    return self.tasks().filter(function (task) {
      return task.taskType() === 'story';
    });
  });

  // modified in array?
  self.submitSprint = function () {
    if (self.sprintForEdit().id === '') {
      self.createSprint();
    } else {
      self.sprintForEdit().update();
    }
  };

  // modified in array?
  self.submitTask = function () {
    if (self.taskForEdit().id === '') {
      self.createTask();
    } else {
      self.taskForEdit().update();
    }
  };

  self.removeSprint = function (sprint) {
    sprint.delete().then(function () {
      self.sprints.remove(sprint);
    });
  };

  self.removeTask = function (task) {
    task.delete().then(function () {
        self.tasks.remove(task);
    });
  };

  self.createProject = function () {
    var data = self.projectForEdit().normalize();

    $.post(Urls.projectListUrl, data).then(function (data) {
      self.projects.push(new Project(data));
    });
  };

  self.createSprint = function () {
    var data = self.sprintForEdit().normalize();

    $.post(Urls.getSprintListUrl(self.currentProject().id), data).then(function (data) {
      self.sprints.push(new Sprint(data));
    });
  };

  self.createTask = function () {
    var data = self.taskForEdit().normalize();

    $.post(Urls.getTaskListUrl(self.currentProject().id), data).then(function (data) {
      self.tasks.push(new Task(data));
    });
  };
}

function Projects() {
  self.init = function () {
    self._toggleMenu = ko.observable(false);
    self._toggleManager = ko.observable(false);

    self.projects = ko.observableArray([]);
    self.currentProject = ko.observable();
    self.projectForEdit = ko.observable();

    self.load();
  };

  self.clear = function () {
    self.projects([]);
  };

  self.load = function () {
    $.getJSON(self.projectsUrl)
      .then(self.populate)
      .then(self.populateDefault);
  };

  self.populate = function (data) {
    var projects = data.map(function (projectData) {
      return new Project(projectData);
    });
    self.projects(projects);
  };

  self.populateDefault = function () {
    // load tasks and sprints
    self.currentProject(self.projects()[0]);
  };

  self.editProject = function (project) {
    self.projectForEdit(project);
  };

  self.newProject = function (project) {
    self.projectForEdit(new Project());
  };

  self.selectProject = function (project) {
    self.currentProject(project);
    self.currentProject().load();
  };

  // modified in array?
  self.submitProject = function () {
    if (self.projectForEdit().id === '') {
      self.createProject();
    } else {
      self.projectForEdit().update();
    }
  };

  self.removeProject = function (project) {
    project.delete().then(function () {
      self.projects.remove(project);
    });
  };

  self.init();
}
