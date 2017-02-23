import pdb

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from todo.models import Task
from todo.api.serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['creator'] = request.user.pk
        pdb.set_trace()
        serializer = self.get_serializer(data=copy_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
