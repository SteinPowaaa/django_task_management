function Project(data) {
    var self = this;

    self.init = function (data) {
        var data = data || {};

        self.dataLoaded = ko.observable(false);

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
        $.getJSON(self.tasksUrl()).then(self.populateTasks);
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

    self.updateProject = function () {
        var project = self.project().normalize();
        return $.ajax({
            url: self.projectsUrl + project.id + '/',
            type: 'PUT',
            data: project
        });
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

    self.populateDefaultSprint = function () {
        self.currentSprint(self.sprints()[0]);
    };

    self.addTaskToSprint = function (task) {
        task.updateSprint(self.currentSprint());
    };

    self.removeTaskFromSprint = function (task) {
        self.task(task);
        self.task().sprint(null);
        self.updateTask();
        self.updateSprint();
    };

    self.normalize = function () {
        return {
            "id": self.id,
            "title": self.title(),
            "description": self.description()
        };
    };

    self.delete = function (project) {
        return $.ajax({
            url: self.projectsUrl + project.id,
            type: 'DELETE'
        });
    };
}



function Projects() {
    self.init = function () {
        self._toggleMenu = ko.observable(false);
        self._toggleManager = ko.observable(false);

        self.load();
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

    self.createProject = function () {
        var projectJSON = self.projectForEditnormalize();
        $.post(self.projectsUrl, projectJSON).then(function (data) {
            self.projects.push(new Project(data));
        });
    };

    self.removeProject = function (project) {
        project.delete().then(function () {
            self.projects.remove(project);
        });
    };

    self.submitProject = function () {
        if (self.projectForEdit().id === '') {
            self.createProject();
        } else {
            self.projectForEdit().update();
        }
    };

    self.init();
}
