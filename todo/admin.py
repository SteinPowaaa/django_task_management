from django.contrib import admin

from .models import Task, Project, Sprint, Comment

admin.site.register(Task)
admin.site.register(Project)
admin.site.register(Sprint)
admin.site.register(Comment)
