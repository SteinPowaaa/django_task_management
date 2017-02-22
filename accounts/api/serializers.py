from rest_framework import serializers

from django.contrib.auth.models import User


class LoginSerializer(serializers.Serializer):
    class Meta:
        fields = ('username', 'password')

    username = serializers.CharField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
