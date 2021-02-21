# Generated by Django 2.2 on 2021-01-04 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('userprofile', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='班级名称')),
            ],
            options={
                'verbose_name': '班级',
                'verbose_name_plural': '班级',
            },
        ),
        migrations.RemoveField(
            model_name='user',
            name='group',
        ),
        migrations.RemoveField(
            model_name='user',
            name='score',
        ),
        migrations.AlterField(
            model_name='user',
            name='no',
            field=models.CharField(max_length=20, unique=True, verbose_name='学号/工号'),
        ),
    ]
