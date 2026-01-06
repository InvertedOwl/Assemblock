from django.db import models

# Create your models here.

class Script(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    title = models.CharField(max_length=255, default="Untitled Script")
    script_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    unlisted = models.BooleanField(default=False)
    favorited_by = models.ManyToManyField('auth.User', related_name='favorite_scripts', blank=True)
    settings_json = models.JSONField(default=dict)
    removed = models.BooleanField(default=False)

    def __str__(self):
        return self.title