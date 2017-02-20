import pytest

from django.conf import settings


# model_mommy

@pytest.fixture()
def user():
	return model_mommy.make(settings.AUTH_USER_MODEL, username='test-user')


@pytest.fixture()
def user2():
	return model_mommy.make(settings.AUTH_USER_MODEL, username='test-user-2')
