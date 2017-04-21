from django.contrib.auth.models import AbstractUser

from imagekit.models import ProcessedImageField
from imagekit.processors import ResizeToFill


def user_directory_path(instance, filename):
    username = 'user' + instance.id
    return '{0}/{1}'.format(username, filename)


class User(AbstractUser):
    avatar_thumbnail = ProcessedImageField(upload_to=user_directory_path,
                                           processors=[ResizeToFill(50, 50)],
                                           format='JPEG',
                                           options={'quality': 60},
                                           blank=True, null=True)
