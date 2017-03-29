from rest_framework import permissions


class isAssigneeOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return any([request.user.id in assignee.values()
                    for assignee in obj.assignees.values('id')])
