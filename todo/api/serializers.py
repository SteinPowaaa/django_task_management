from django.contrib.auth import get_user_model

from rest_framework import serializers

from todo.models import Task, Project, Sprint, Comment
from accounts.api.serializers import UserSerializer

User = get_user_model()


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(CommentSerializer, self).create(validated_data)


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'id',
            'status',
            'priority',
            'task_type',
            'title',
            'description',
            'assignees',
            'project',
            'sprint',
            'ref_task',
            'location',
            'estimation',
            'forecast'
        )

    assignees = UserSerializer(many=True, read_only=True)

    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        assignee_ids = self.initial_data.get('assignees')
        task = Task.objects.create(**validated_data)
        task.assignees = User.objects.filter(id__in=assignee_ids)
        task.save()
        return task


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = '__all__'
