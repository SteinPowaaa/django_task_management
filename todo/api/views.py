from django.contrib.auth import get_user_model

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view

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

    def create(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['creator'] = request.user.pk
        assignee_ids = request.data.get('assignees')
        serializer = self.get_serializer(data=copy_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        assignees = User.objects.filter(id__in=assignee_ids)

        serializer.instance.assignees = assignees

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        try:
            comment_ids = request.data.getlist('comments[]')
            comments = Comment.objects.filter(id__in=comment_ids)
            serializer.instance.comments = comments
        except:
            pass

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)


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

    def create(self, request, *args, **kwargs):
        copy_data = request.data.copy()
        copy_data['author'] = request.user.pk
        serializer = self.get_serializer(data=copy_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)


@api_view(['POST'])
def upload_attachment(request, *args, **kwargs):
    import pdb;pdb.set_trace()
    attachment = [attached_file for attached_file in request.data.values()][0]
    comment = Comment.objects.filter(id=kwargs['pk'])[0]
    comment.attachment = attachment
    comment.save()
    return Response(comment.attachment.url, status=status.HTTP_200_OK)
