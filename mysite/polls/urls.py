from django.urls import path

from . import views

#could use a viewset

urlpatterns = [
    path('', views.index, name='index'),
    # ex: /polls/5/
    path('<int:question_id>/', views.detail, name='detail'),
    # ex: /polls/5/results/
    path('<int:question_id>/results/', views.results, name='results'),
    # ex: /polls/5/vote/
    path('<int:question_id>/vote/', views.vote, name='vote'),
    
    path('addLink/', views.addLink, name='addLink'),
    path('addFolder/', views.addFolder, name='addFolder'),
    path('<int:my_id>/deletes/', views.deletes, name='deletes'),
    path('<int:my_id>/getBookmark/', views.getBookmark, name='getBookmark'),
]