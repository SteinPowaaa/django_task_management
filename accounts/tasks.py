from __future__ import absolute_import

from django.core import mail

from celery.decorators import task


@task()
def user_send_email(user_email):
    return mail.send_mail(
        'Successful registration',
        'Thank you for registering at Minimal TMS',
        'webmaster@localhost',
        [user_email],
    )
