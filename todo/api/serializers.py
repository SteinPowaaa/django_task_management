from rest_framework import serializers

from todo.models import Task, Project, Sprint
from accounts.api.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    assignees = UserSerializer(many=True, read_only=True)
    # sprint, creator serializer


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = '__all__'

    # task serializer?
