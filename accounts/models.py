from django.contrib.auth.models import AbstractUser
from django.db import models

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


def user_directory_path(instance, filename):
    return '{0}/{1}'.format(instance.username, filename)


class User(AbstractUser):
    avatar_thumbnail = ProcessedImageField(upload_to=user_directory_path,
                                           processors=[ResizeToFill(100, 50)],
                                           format='JPEG',
                                           options={'quality': 60},
                                           blank=True, null=True)
