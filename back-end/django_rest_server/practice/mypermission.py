from rest_framework import permissions
from userprofile.models import Teacher


class AdminPermission(permissions.BasePermission):
    """ 教师（管理员）权限认证 """
    message = '只有管理员才能访问'

    def has_permission(self, request, view):
        user = request.user
        if Teacher.objects.filter(tea=user):
            return True
        else:
            return False
