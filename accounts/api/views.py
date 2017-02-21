from django.http import JsonResponse
from django.contrib.auth import login as django_login, \
    logout as django_logout, authenticate

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from accounts.api.serializers import LoginSerializer


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'details': 'BAD CREDENTIALS'},
                        status=status.HTTP_400_BAD_REQUEST)

    django_login(request, user)
    return Response({'details': 'OK'}, status=status.HTTP_202_ACCEPTED)


def logout(request):
    django_logout(request)
    return JsonResponse({'details': 'OK'}, status=status.HTTP_202_ACCEPTED)

# return Response('', status=status.HTTP_202_ACCEPTED)
