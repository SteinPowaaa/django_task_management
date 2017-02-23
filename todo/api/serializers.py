import pdb
from django.contrib.auth.models import User

from rest_framework import serializers

from todo.models import Task
from accounts.api.serializers import UserSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    assignees = UserSerializer(many=True)

    def save(self, **kwargs):
        # pdb.set_trace()
        assignees_ids = self.validated_data.pop('assignees')
        assignees = list(map(lambda user_id: User.objects.get(id=user_id), assignees_ids))
        task = super(TaskSerializer, self).save(**kwargs)
        task.assignees.add(assignees)
