from django.contrib.auth import authenticate, login, logout
from practice.views import TeacherPermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User
from .serializers import StudentSerializer


class StudentDetial(APIView):
    """ 单个学生 """
    def has_student(self, no):
        # 判断该学生是否存在
        try:
            student = User.objects.get(no=no)
            if student is not None:
                return True
        except User.DoesNotExist:
            return False

    # 学生注册
    def post(self, request):
        no = request.data["no"]
        if self.has_student(no) is False:
            username = request.data["name"]
            password = request.data["password"]
            class_grade = request.data["group"]
            user = User.objects.create_user(no=no,
                                            username=username,
                                            password=password,
                                            class_grade=class_grade)
            user.save()
            # 注册后登录
            login(request, user)
            return Response({
                "code": 1,
                "data": {
                    "no": user.no,
                    "name": user.username,
                    "isSuper": user.is_superuser,
                    "finished": user.finished
                }
            })
        else:
            return Response({"code": 0, "errMsg": "学号已存在"})


class StudentList(APIView):
    """ 所有学生列表（管理员） """
    permission_classes = [IsAuthenticated & TeacherPermission]

    def get(self, request):
        # 获取所有的学生信息
        students = User.objects.filter(is_superuser=False)
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)


class UserLogin(APIView):
    """ 用户登录 """
    def post(self, request):
        userNo = request.data["no"]
        password = request.data["password"]
        isSuper = request.data["isSuper"]
        user = authenticate(request, no=userNo, password=password)
        if user and user.is_superuser == isSuper:
            login(request, user)
            return Response({
                "code": 1,
                "data": {
                    "no": user.no,
                    "name": user.username,
                    "isSuper": user.is_superuser,
                    "finished": user.finished
                }
            })
        else:
            return Response({"code": 0, "errMsg": "用户名与密码不匹配"})


class UserLogout(APIView):
    """ 用户登出 """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        logout(request)
        return Response({"code": 1})
