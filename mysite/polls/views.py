from re import I
from unicodedata import name
from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import Http404
from urllib3 import HTTPResponse

from .serializers import ItemSerializer

from .models import Question, Item

from django.template import loader

from django.shortcuts import get_object_or_404, render

# from django.utils import simplejson
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from django.core import serializers

from rest_framework.renderers import JSONRenderer

@csrf_exempt
def index(request):
    print(Item.objects.all());
    return JsonResponse({"msg":"got it", "a":7})

@csrf_exempt
def getAll(request):
    items = Item.objects.all()
    serialized_obj = ItemSerializer(items, many=True)
    return JsonResponse(serialized_obj.data, safe=False)

@csrf_exempt
def getBookmark(request, my_id):
    item = Item.objects.get(pk=my_id)
    print(item)
    serialized_obj = ItemSerializer(item)
    print(serialized_obj.data)
    return JsonResponse(serialized_obj.data);
    
@csrf_exempt
def addLink(request):
    print("HAKLSDJLKASJDLKJASLDJsa");
    print(request.POST);
    print(request.POST.get('par_id',0))
    par = Item.objects.get(pk=request.POST['par_id']);
    print("PAR: ", par)
    newLink = Item.objects.create(
        link=request.POST['link'],
        title=request.POST['title'],
        par_id=request.POST['par_id'],
        type="Link",
        depth=par.depth+1
    )
    tmp = par.child_id;
    tmp = tmp+","+str(newLink.id)
    par.child_id=tmp
    par.save()
    print("HI",par.child_id)
    print(newLink);
    
    return HttpResponse("Success");

@csrf_exempt
def addFolder(request):
    par = Item.objects.get(pk=request.POST['par_id'])
    #needs to be type addFolder
    if par.type != "Folder" and par.id!=1:
        print("NONO Folder")
        raise Http404("Not a folder")
        
    newFolder = Item.objects.create(
        title=request.POST['title'],
        par_id=request.POST['par_id'],
        type="Folder",
        depth=par.depth+1
    )
    tmp = par.child_id+","+str(newFolder.id)
    par.child_id = tmp
    par.save()
    
    print(Item.objects.all());
    # TODO: par add child id
    return HttpResponse("Success");

@csrf_exempt
def deletes(request, my_id):
    item = Item.objects.get(pk=my_id)
    if (item.type=="Link") :
        item.delete()
    else :
        #TODO: UNTESTED
        print("is folder")
        for x in item.child_id.split(','):
            deletes(request, x)
    print(Item.objects.all())
    return HttpResponse("Success");

def sorts(request, my_id):
    item = Item.objects.get(pk=my_id)
    #sort by title first name
    childArr = item.child_id.split(',')
    if '' in childArr:
        childArr.remove('')
    
    childArr2=[]
    for x in range(len(childArr)):
        if (Item.objects.filter(pk=childArr[x]).exists()):
            childArr2.append(childArr[x])

    sortedArr = sorted(childArr2, key=lambda x: Item.objects.get(pk=int(x)).title.lower());
    
    retJoin = "";
    for x in range(len(sortedArr)):
        if(x!=0):
            retJoin+=","
        retJoin+=str(sortedArr[x])
    item.child_id=retJoin
    item.save()
    print(item.child_id)
    return HttpResponse("Success")
