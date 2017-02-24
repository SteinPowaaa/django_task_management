import pdb
from django.contrib.auth.models import User

from rest_framework import serializers

from todo.models import Task
from accounts.api.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    assignees = UserSerializer(many=True, read_only=True)
