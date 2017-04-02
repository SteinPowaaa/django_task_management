function PageViewModel() {
    var self = this;

    self.init = function () {
        self.sprint = ko.observable(new Sprint({ "id": 1 }));
        self.sprints = ko.observableArray([]);
        self.currentSprint = ko.observable(new Sprint({"id": 1})); // remove initial value

        self.project = ko.observable(new Project({ "id": 1 }));
        self.projects = ko.observableArray([]);
        self.currentProject = ko.observable(new Project({"id": 1})); // remove initial value

        // change name to current task
        self.task = ko.observable(new Task({}));
        // put tasks in projects and get from there
        self.tasks = ko.observableArray([]);

        self.currentUser = ko.observable();
        self.users = ko.observableArray([]);
    };

    // put in user

    self.loadUsers = function () {
        return $.getJSON(self.usersUrl).then(self.populateUsers);
    };

    self.populateUsers = function (data) {
        var users = data.map(function (userData) {
            return new User(userData);
        });
        self.users(users);
    };

    self.toggleMenu = function () {
        self._toggleMenu(!self._toggleMenu());
    };

    self.toggleManager = function () {
        self._toggleManager(!self._toggleManager());
    };


    self.clearData = function () {
        self.tasks([]);
        self.projects([]);
        self.sprints([]);
        self.users([]);
    };

    self.login = function () {
    };

    self.init();
}
