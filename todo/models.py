import uuid

from django.db import models
from django.conf import settings


def user_directory_path(instance, filename):
    filename = str(uuid.uuid4()) + filename
    task_name = 'task' + str(instance.task.id)
    comment_name = 'comment' + str(instance.id)
    return '{0}/{1}/{2}'.format(task_name, comment_name, filename)


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

    task_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default=TYPE_IMPROVEMENT
    )

    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1024, blank=True)

    creator = models.ForeignKey(settings.AUTH_USER_MODEL,
                                related_name='task_creator')
    assignees = models.ManyToManyField(settings.AUTH_USER_MODEL,
                                       related_name='task_assignees')

    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    sprint = models.ForeignKey('Sprint', on_delete=models.SET_NULL,
                               null=True, blank=True)
    ref_task = models.ForeignKey('self', null=True, blank=True)

    location = models.CharField(max_length=50, blank=True, null=True)
    estimation = models.DateField(blank=True, null=True)
    forecast = models.NullBooleanField()


class Project(models.Model):
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1024, blank=True)


class Sprint(models.Model):
    project = models.ForeignKey('Project', on_delete=models.CASCADE)
    title = models.CharField(max_length=50)
    description = models.CharField(max_length=1024, blank=True)


class Comment(models.Model):
    task = models.ForeignKey('Task', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL)
    text = models.CharField(max_length=50)
    attachment = models.FileField(upload_to=user_directory_path,
                                  blank=True, null=True)
