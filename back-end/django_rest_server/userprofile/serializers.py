from rest_framework import serializers
from .models import User


class StudentSerializer(serializers.ModelSerializer):
    """ 学生信息序列化器 """
    class Meta:
        model = User
        fields = ('no', 'username', 'class_grade', 'finished', 'score')
