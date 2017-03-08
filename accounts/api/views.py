from django.contrib.auth.models import User
from django.contrib.auth import login as django_login, \
    logout as django_logout, authenticate

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.api.serializers import LoginSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(username=username, password=password)
    if not user:
        return Response({'details': 'BAD CREDENTIALS'},
                        status=status.HTTP_401_UNAUTHORIZED)

    django_login(request, user)
    return Response({'username': username}, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
def logout(request):
    django_logout(request)
    return Response({'details': 'OK'}, status=status.HTTP_202_ACCEPTED)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
