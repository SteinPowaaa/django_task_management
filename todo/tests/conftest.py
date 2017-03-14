import pytest

from django.contrib.auth import get_user_model
# from django.conf import settings

from todo.models import Task, Project

from model_mommy import mommy

User = get_user_model()


@pytest.fixture
def user():
    # user = mommy.make(
    #     settings.AUTH_USER_MODEL,
    #     username='admin'
    # )
    # user.set_password('password123')
    # return user
    return User.objects.create_user(username='admin', password='password123')


@pytest.fixture
def project_one():
    return mommy.make(Project)


@pytest.fixture
def project_two():
    return mommy.make(Project)


@pytest.fixture
def task_one():
    return mommy.make(
        Task,
        project_id=1
                      )


@pytest.fixture
def task_two():
    return mommy.make(
        Task,
        project_id=1
    )
