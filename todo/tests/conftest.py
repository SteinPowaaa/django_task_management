import pytest

from django.conf import settings
from todo.models import Task, Project

from model_mommy import mommy

@pytest.fixture
def user():
    return mommy.make(settings.AUTH_USER_MODEL)

@pytest.fixture
def project():
    pass
