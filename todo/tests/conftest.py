import pytest
from unittest.mock import MagicMock

from django.contrib.auth import get_user_model
from django.test import Client
from django.core.files import File

from model_mommy import mommy

User = get_user_model()


@pytest.fixture
def client(user):
    c = Client()
    c.force_login(user)
    return c


@pytest.fixture
def user():
    return User.objects.create_user(username='admin', password='password123')


@pytest.fixture
def project_default():
    return mommy.make('Project')


@pytest.fixture
def task_default():
    return mommy.make(
        'Task',
        project_id=1,
                      )


@pytest.fixture
def task_with_assignee(user):
    return mommy.make(
        'Task',
        project_id=1,
        assignees=[user]
    )


@pytest.fixture
def sprint_default():
    return mommy.make(
        'Sprint',
        project_id=1
    )


@pytest.fixture
def comment_default(task_default):
    return mommy.make(
        'Comment',
        task=task_default
    )


@pytest.fixture
def comment_with_assignee(task_with_assignee):
    return mommy.make(
        'Comment',
        task=task_with_assignee
    )


@pytest.fixture
def file_default():
    mock_file = MagicMock(spec=File)
    mock_file.read.return_value = "lorem ipsum"
    return mock_file
