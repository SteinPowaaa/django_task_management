from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as OriginalUserAdmin

from .models import User


class UserAdmin(OriginalUserAdmin):
    pass


admin.site.register(User, UserAdmin)
