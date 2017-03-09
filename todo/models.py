from django.db import models
from django.contrib.auth.models import User


class Task(models.Model):
    STATUS_TODO = 'todo'
    STATUS_IN_PROGRESS = 'in-progress'
    STATUS_COMPLETED = 'completed'

    STATUS_CHOICES = (
        (STATUS_TODO, 'Todo'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed')
    )

    PRIORITY_HIGH = 'high'
    PRIORITY_MEDIUM = 'medium'
    PRIORITY_LOW = 'low'

    PRIORITY_CHOICES = (
        (PRIORITY_HIGH, 'High'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_LOW, 'Low')
    )
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1024, blank=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default=STATUS_TODO
    )

    priority = models.CharField(
        max_length=30,
        choices=PRIORITY_CHOICES,
        default=PRIORITY_LOW
    )

    creator = models.ForeignKey(User, related_name="task_creator")
    assignees = models.ManyToManyField(User, related_name="task_assignees")

    TYPE_STORY = 'story'
    TYPE_BUG = 'bug'
    TYPE_IMPROVEMENT = 'improvement'
    TYPE_SUB_TASK = 'sub-task'

    TYPE_CHOICES = (
        (TYPE_STORY, 'Story'),
        (TYPE_BUG, 'Bug'),
        (TYPE_IMPROVEMENT, 'Improvement'),
        (TYPE_SUB_TASK, 'Sub Task')
    )

    task_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default=TYPE_IMPROVEMENT
    )

    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    ref_task = models.ForeignKey('self', null=True, blank=True)

    location = models.CharField(max_length=50, blank=True)
    estimation = models.DateField(blank=True)
    forecast = models.BooleanField(blank=True)


class Project(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1024, blank=True)
