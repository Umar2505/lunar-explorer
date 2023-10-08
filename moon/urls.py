from django.urls import path
from . import views
from .models import *

app_name = 'moon'

urlpatterns = [ 
	path('',views.main, name='home'),
	path('moon/',views.moon_globe_view, name='moon'),
    ]