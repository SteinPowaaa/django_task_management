import pytest

from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(username='admin', password='password123')


@pytest.fixture
def client():
    return Client()
