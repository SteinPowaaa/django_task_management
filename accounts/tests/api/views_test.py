import pytest

from django.test import Client

from rest_framework import status


@pytest.mark.django_db
class TestAccounts:
    def test_accounts__login(self, user):
        self.c = Client()
        response = self.c.post('/api/login/', {'username': 'admin',
                                               'password': 'password123'})
        assert response.status_code == status.HTTP_202_ACCEPTED

    def test_accounts__logout(self, user):
        self.c = Client()
        self.c.login(username='admin', password='password123')
        response = self.c.post('/api/logout/', {'username': 'admin',
                                                'password': 'password123'})
        assert response.status_code == status.HTTP_202_ACCEPTED

    def test_accounts__invalid_login(self, user):
        self.c = Client()
        response = self.c.post('/api/login/', {'username': 'admin',
                                               'password': 'bananawhip'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_accounts__no_credentials_login(self, user):
        self.c = Client()
        response = self.c.post('/api/login/')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_accounts__no_login_logout(self, user):
        self.c = Client()
        response = self.c.post('/api/logout/', {'username': 'admin',
                                                'password': 'password123'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_accounts__register(self, user):
        self.c = Client()
        self.c.login(username='admin', password='password123')
        response = self.c.post('/api/logout/', {'username': 'admin',
                                                'password': 'password123'})
        assert response.status_code == status.HTTP_202_ACCEPTED
