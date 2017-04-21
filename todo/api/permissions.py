from todo.models import Task

from rest_framework import permissions


class IsAssigneeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return any([request.user.id in assignee.values()
                    for assignee in obj.assignees.values('id')])


class IsCorrectUserOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        task = Task.objects.get(id=obj.task.id)

        return any([request.user.id in assignee.values()
                    for assignee in task.assignees.values('id')])
