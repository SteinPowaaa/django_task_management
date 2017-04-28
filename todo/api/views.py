from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from todo.models import Task, Project, Sprint, Comment
from todo.api.serializers import TaskSerializer, ProjectSerializer, \
    SprintSerializer, CommentSerializer
from todo.api.permissions import IsAssigneeOrReadOnly, IsCorrectUserOrReadOnly

User = get_user_model()


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = (IsAssigneeOrReadOnly,)

    def get_queryset(self):
        project_pk = self.kwargs['project_pk']
        return Task.objects.filter(project=project_pk)

    @detail_route(['PUT'])
    def change_status(self, request, *args, **kwargs):
        task = self.get_object()
        task.status = request.data.get('status')
        task.save()
        return Response(task.status, status=status.HTTP_200_OK)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class SprintViewSet(viewsets.ModelViewSet):
    queryset = Sprint.objects.all()
    serializer_class = SprintSerializer

    def get_queryset(self):
        project_pk = self.kwargs['project_pk']
        return Sprint.objects.filter(project=project_pk)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (IsCorrectUserOrReadOnly,)

    def get_queryset(self):
        task_pk = self.kwargs['task_pk']
        return Comment.objects.filter(task=task_pk)

    @detail_route(['POST'])
    def attachment(self, request, *args, **kwargs):
        attachment = [attached_file for attached_file in
                      request.data.values()][0]
        comment = self.get_object()
        comment.attachment = attachment
        comment.save()
        return Response(comment.attachment.url, status=status.HTTP_200_OK)
