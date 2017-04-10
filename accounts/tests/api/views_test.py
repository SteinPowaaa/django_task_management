import pytest

from django.urls import reverse

from rest_framework import status


@pytest.mark.django_db
class TestAccounts:
    def test_accounts__login(self, user, client):
        url = reverse('login')
        response = client.post(url, {'username': 'admin',
                                     'password': 'password123'})
        assert response.status_code == status.HTTP_202_ACCEPTED

    def test_accounts__logout(self, user, client):
        url = reverse('logout')
        client.login(username='admin', password='password123')
        response = client.post(url, {'username': 'admin',
                                     'password': 'password123'})
        assert response.status_code == status.HTTP_202_ACCEPTED

    def test_accounts__invalid_login(self, user, client):
        url = reverse('login')
        response = client.post(url, {'username': 'admin',
                                     'password': 'bananawhip'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_accounts__no_credentials_login(self, user, client):
        url = reverse('login')
        response = client.post(url)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_accounts__no_login_logout(self, user, client):
        url = reverse('logout')
        response = client.post(url, {'username': 'admin',
                                     'password': 'password123'})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_accounts__register(self, user, client):
        url = reverse('register')
        response = client.post(url, {'username': 'stein',
                                     'password': 'password123',
                                     'email': 'stein@example.com'})
        assert response.data['details'] == 'OK'
