from django.urls import path
from . import views

urlpatterns = [
    path('', view=views.index, name="index"),
    path('me/', view=views.get_me, name="get_me"),
    path('script/', view=views.script, name="script"),
    path('scripts/', view=views.scripts, name="scripts"),
    path('public_scripts/', view=views.public_scripts, name="public_scripts"),
]