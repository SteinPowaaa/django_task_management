function Project(data) {
  var self = this;

  self.init = function () {
    data = data || {};

    self.dataLoaded = ko.observable(false);

    self.sprints = ko.observableArray([]);
    self.tasks = ko.observableArray([]);

    self.currentSprint = ko.observable();

    self.sprintForEdit = ko.observable();
    self.taskForEdit = ko.observable();

    self.id = data.id || "";
    self.title = ko.observable(data.title || "");
    self.description = ko.observable(data.description || "");

    self.taskTodo = ko.computed(self.filterStatus.bind(self, 'todo'));
    self.tasksInProgress = ko.computed(self.filterStatus.bind(self, 'in-progress'));
    self.tasksCompleted = ko.computed(self.filterStatus.bind(self, 'completed'));
    self.taskStory = ko.computed(self.filterType.bind(self, 'story'));

    Arbiter.subscribe('task.created', self.addTask);
    Arbiter.subscribe('task.created', self.addSprint);
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
    $.getJSON(Urls().getTaskListUrl(self.id)).then(self.populateTasks);
  };

  self.populateTasks = function (data) {
    var tasks = data.map(function (taskData) {
      return new Task(taskData);
    });

    self.tasks(tasks);
  };

  self.loadSprints = function () {
    $.getJSON(Urls().getSprintListUrl(self.id))
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
    return $.ajax({
      url: Urls().getProjectDetailUrl(self.id),
      type: 'PUT',
      data: self.normalize()
    });
  };

  self.delete = function (project) {
    return $.ajax({
      url: Urls().getProjectDetailUrl(project.id),
      type: 'DELETE'
    });
  };

  self.normalize = function () {
    return {
      id: self.id,
      title: self.title(),
      description: self.description()
    };
  };

  self.editSprint = function(sprint){
    self.sprintForEdit(sprint);
  };

  self.newSprint = function () {
    self.sprintForEdit(new Sprint());
  };

  self.editTask = function (task) {
    self.taskForEdit(task);
  };

  self.newTask = function () {
    self.taskForEdit(new Task());
  };

  self.addTaskToSprint = function (task) {
    task.updateSprint(self.currentSprint());
  };

  self.removeTaskFromSprint = function (task) {
    task.updateSprint(null);
  };

  self.filterStatus = function (status) {
    return self.tasks().filter(function (task) {
      return task.status() === status;
    });
  };

  self.filterType = function (taskType) {
    return self.tasks().filter(function (task) {
      return task.taskType() === taskType;
    });
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

  self.create = function () {
    var data = self.normalize();

    $.post(Urls().projectListUrl, data).then(function (data) {
      Arbited.publish('project.created', data);
    });
  };

  self.submit = function () {
    if (self.id) {
      self.create();
    } else {
      self.update();
    }
  };

  self.addTask = function (data) {
    self.tasks.push(new Task(data));
  };

  self.addSprint = function (data) {
    self.sprints.push(new Sprint(data));
  };

  self.init();
}

function ProjectsViewModel() {
  var self = this;

  self.init = function () {
    self.projects = ko.observableArray([]);
    self.currentProject = ko.observable();
    self.projectForEdit = ko.observable();

    Arbiter.subscribe('project.created', self.addProject);
    Arbiter.subscribe('loggedIn', self.load);
    Arbiter.subscribe('loggedOut', self.clear);

    self.load();
  };

  self.clear = function () {
    self.projects([]);
  };

  self.load = function () {
    $.getJSON(Urls().projectListUrl)
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
    self.currentProject(self.projects()[0]);
  };

  self.editProject = function (project) {
    self.projectForEdit(project);
  };

  self.newProject = function () {
    self.projectForEdit(new Project());
  };

  self.selectProject = function (project) {
    self.currentProject(project);
    self.currentProject().load();
  };

  self.removeProject = function (project) {
    project.delete().then(function () {
      self.projects.remove(project);
    });
  };

  self.addProject = function (data) {
    self.projects.push(new Project(data));
  };

  self.init();
}
