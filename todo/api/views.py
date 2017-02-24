import pdb

from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from todo.models import Task
from todo.api.serializers import TaskSerializer


User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['creator'] = request.user.pk
        assignee_ids = request.data.getlist('assignees[]', [])
        serializer = self.get_serializer(data=copy_data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        assignees = list(map(lambda user_id: User.objects.get(id=user_id),
                        assignee_ids))

        pdb.set_trace()
        serializer.instance.assignees = assignees

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
