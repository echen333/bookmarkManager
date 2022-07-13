from django.urls import path

from . import views

#could use a viewset

urlpatterns = [
    path('', views.index, name='index'),
    
    path('addLink/', views.addLink, name='addLink'),
    path('getAll/', views.getAll, name='getAll'),
    path('addFolder/', views.addFolder, name='addFolder'),
    path('pasteItems/', views.pasteItems, name='pasteItems'),
    path('<int:my_id>/deletes/', views.deletes, name='deletes'),
    path('<int:my_id>/getBookmark/', views.getBookmark, name='getBookmark'),
    path('<int:my_id>/sorts/', views.sorts, name='sorts'),
    path('<int:my_id>/<int:parId>/changePar/', views.changePar, name='changePar'),
    path('<int:my_id>/<int:fixed_id>/<int:isBef>/changeOrder/', views.changeOrder, name='changeOrder'),
]