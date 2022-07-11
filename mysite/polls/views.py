from re import I
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
    # return HttpResponse("Hello, world. You're at the polls index.")
    
    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    # template = loader.get_template('polls/index.html')
    # context = {
    #     'latest_question_list': latest_question_list,
    # }
    print(Item.objects.all());
    return JsonResponse({"msg":"got it", "a":7})
    # return JsonResponse(latest_question_list, safe=False)
    # return HttpResponse(template.render(context, request))

    # context = {'latest_question_list': latest_question_list}
    # return render(request, 'polls/index.html', context)

#TODO: getChildrenBookmark
# loop through children and only return type, id, link,
#TODO: getAllBookmarks
# return all objects to populate sidebar

@csrf_exempt
def getBookmark(request, my_id):
    item = Item.objects.get(pk=my_id)
    print(item)
    serialized_obj = ItemSerializer(item)
    print(serialized_obj.data)
    return JsonResponse(serialized_obj.data);
    
@csrf_exempt
def addLink(request):
    # add new Item
    newLink = Item.objects.create(
        link=request.POST['link'],
        title=request.POST['title'],
        par_id=request.POST['par_id'],
        type="Link",
        depth="1" #HERE
    )
    par = Item.objects.get(pk=request.POST['par_id']);
    # tmp = ","+str(newLink.id)
    tmp = par.child_id;
    tmp = tmp+","+str(newLink.id)
    print(tmp)
    par.child_id=tmp
    par.save()
    print(par)
    print("HI",par.child_id)
    print(tmp)
    
    # how ^ ??
    # TODO: children add id
    return HttpResponse("Success");

@csrf_exempt
def addFolder(request):
    newFolder = Item.objects.create(
        # link=request.POST['link'],
        title=request.POST['title'],
        par_id=request.POST['par_id'],
        type="Folder",
        depth="1" #HERE
    )
    par = Item.objects.get(pk=request.POST['par_id'])
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

def detail(request, question_id):
    # return HttpResponse("You're looking at question %s." % question_id)
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, 'polls/detail.html', {'question': question})

    # question = get_object_or_404(Question, pk=question_id)
    # return render(request, 'polls/detail.html', {'question': question})

def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)