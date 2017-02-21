function Task({title, description, status,
               priority, creator, assignees}={}) {
  // this.title = ko.observable(data.title) => if param is data(json)
  this.title = ko.observable(title);
  this.description = ko.observable(description);
  this.status = ko.observable(status);
  this.priority = ko.observable(priority);
  this.creator = creator;
  this.assigness = ko.observable(assignees);
}

function TaskViewModel() {
  var url = 'http://127.0.0.1:8000/api/tasks/';
  this.tasks = ko.observableArray([]);

  this._populateTasks = function (data) {
    data.forEach(function (json) {
      this.tasks.push(new Task(json));
    })
  }.bind(this);

  // $.postJSON()

  $.getJSON(url, function (data) {
    this._populateTasks(data)
  }).bind(this);
}
