from django.contrib.auth import get_user_model

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

from todo.models import Task, Project
from todo.api.serializers import TaskSerializer, ProjectSerializer

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def list(self, request, project_pk=None):
        queryset = self.queryset.filter(project=project_pk)
        serializer = TaskSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, project_pk=None):
        queryset = self.queryset.get(pk=pk, project=project_pk)
        serializer = TaskSerializer(queryset)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['creator'] = request.user.pk
        assignee_ids = request.data.getlist('assignees[]', [])
        serializer = self.get_serializer(data=copy_data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        # http://stackoverflow.com/questions/37511421/add-an-object-by-id-in-a-manytomany-relation-in-django
        assignees = User.objects.filter(id__in=assignee_ids)

        serializer.instance.assignees = assignees

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
