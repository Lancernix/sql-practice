from .models import Question
from .serializers import QuestionSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, IsAuthenticated
from userprofile.models import User
from userprofile.serializers import StudentSerializer
from django.db import connections
from django.db.utils import ProgrammingError
import random
import collections
from .answers import get_answers


class TeacherPermission(BasePermission):
    """ 教师（管理员）权限认证 """
    message = '只有管理员才能访问'

    def has_permission(self, request, view):
        user = request.user
        if user.is_superuser is True:
            return True
        else:
            return False


class StudentAction(APIView):
    """ 学生操作 """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # 获取所有的题目
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request):
        # 获取用户
        user = User.objects.get(no=request.user)
        if user.finished is False:
            # 获取标准答案
            answers = get_answers()
            # 获取学生输入
            data = []
            for key in collections.OrderedDict(request.data).keys():
                data.append(collections.OrderedDict(request.data)[key])
            score = get_socre(data, answers)
            user.finished = True
            user.score = score
            user.save(update_fields=['finished', 'score'])
        return Response({
            "code": 1,
            "data": {
                "no": user.no,
                "name": user.username,
                "isSuper": user.is_superuser,
                "finished": user.finished
            }
        })


class AdminAction(APIView):
    """ 管理员操作（管理员） """
    permission_classes = [IsAuthenticated & TeacherPermission]

    def get(self, request):
        # 获取所有学生
        students = User.objects.filter(is_superuser=False)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


def get_socre(data, answers):
    score = 0
    with connections['stu'].cursor() as cursor:
        for i in range(len(data)):
            try:
                cursor.execute(data[i])
                sql_result = cursor.fetchall()
                if sorted(sql_result) == sorted(answers[i]):
                    score += 1
            except ProgrammingError:
                pass
        score += (15 - score) * (0.4 + random.random() * 0.2)
    return (float('%.1f' % (score / 0.15)))
