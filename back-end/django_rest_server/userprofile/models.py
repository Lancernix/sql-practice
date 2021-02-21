from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    """ 自定义UserManager管理器 """
    def _create_user(self, no, username, password, **extra_fields):
        if not no:
            raise ValueError('学号/工号不能为空')
        if not username:
            raise ValueError('姓名不能为空')
        if not password:
            raise ValueError('密码不能为空')
        username = self.model.normalize_username(username)
        user = self.model(no=no, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, no, username, password, **extra_fields):
        # 创建普通用户
        return self._create_user(no, username, password, **extra_fields)

    def create_superuser(self, no, username, password, **extra_fields):
        # 创建管理员用户
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self._create_user(no, username, password, **extra_fields)


class User(AbstractUser):
    """ 自定义User """
    no = models.CharField(unique=True, verbose_name='学号/工号', max_length=20)
    username = models.CharField(verbose_name='姓名', max_length=50)
    class_grade = models.CharField(verbose_name='班级名称',
                                   max_length=50,
                                   blank=True)
    finished = models.BooleanField(verbose_name='是否完成', default=False)
    score = models.SmallIntegerField(verbose_name='分数', default=0)

    objects = UserManager()

    USERNAME_FIELD = 'no'  # 使用 authenticate 验证时使用的验证字段，可以换成其他字段，但验证字段必须是 unique=True
    REQUIRED_FIELDS = [
        'username'
    ]  # 创建用户时必须填写的字段，除了该列表里的字段还包括 password 字段以及 USERNAME_FIELD 中的字段

    class Meta:
        verbose_name = '用户'
        verbose_name_plural = verbose_name  # 模型的复数形式，不设置自动加一个‘s’

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username
