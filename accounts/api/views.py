import uuid
from base64 import b64decode

from django.db import IntegrityError
from django.core.files.base import ContentFile
from django.contrib.auth import login as django_login, \
    logout as django_logout, authenticate, get_user_model

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from accounts.api.serializers import LoginSerializer, UserSerializer, \
    RegisterSerializer

from accounts.tasks import user_send_email

User = get_user_model()


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
    return Response({'details': serializer.data}, status=status.HTTP_202_ACCEPTED)


@api_view(['POST'])
def logout(request):
    django_logout(request)
    return Response({'details': 'OK'}, status=status.HTTP_202_ACCEPTED)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    # @list_route(['GET'])
    # def current(self, request):
    #     pass


def transform_avatar(avatar_b64):
    image_base64 = avatar_b64.split('base64,', 1)
    image_data = b64decode(image_base64[1])
    image_name = str(uuid.uuid4())+".jpg"
    return ContentFile(image_data, image_name)


@api_view(['POST'])
@permission_classes([])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    email = serializer.validated_data['email']
    avatar_thumbnail = request.data.get('avatar_thumbnail')
    user = User(username=username, email=email)

    if avatar_thumbnail:
        avatar_thumbnail = transform_avatar(request.data.get('avatar_thumbnail'))
        user.avatar_thumbnail = avatar_thumbnail

    user.set_password(password)

    try:
        user.save()
        user_send_email.delay(user.email)
        return Response({'details': 'OK'}, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({'details': 'USER ALREADY EXISTS'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response({'details': serializer.data}, status=status.HTTP_200_OK)
