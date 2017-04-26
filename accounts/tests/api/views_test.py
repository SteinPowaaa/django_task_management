import pytest

from django.urls import reverse

from rest_framework import status

from accounts.tasks import user_send_email


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

    def test_accounts__register_no_avatar(self, user, client):
        url = reverse('register')
        response = client.post(url, {'username': 'noavatar',
                                     'password': 'password123',
                                     'email': 'stein@example.com'})
        assert response.data['details'] == 'OK'

    def test_accounts__register_with_avatar(self, user, client):
        url = reverse('register')
        image = 'data:image/jpeg;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
        response = client.post(url, {'username': 'avatar',
                                     'password': 'password123',
                                     'email': 'stein@example.com',
                                     'avatar_thumbnail': image})
        assert response.data['details'] == 'OK'

    def test_accounts__register_exists(self, user, client):
        url = reverse('register')
        response = client.post(url, {'username': 'admin',
                                     'password': 'password123',
                                     'email': 'admin@example.com'})
        assert response.data['details'] == 'USER ALREADY EXISTS'

    def test_accounts__send_email(self, user):
        assert user_send_email(user) == 1
