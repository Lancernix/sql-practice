from django.db import models


class Question(models.Model):
    content = models.CharField(max_length=500, verbose_name='题目详情')

    class Meta:
        verbose_name = '题目'
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.content
