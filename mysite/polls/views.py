from re import I
from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.http import Http404

from .models import Question, Item

from django.template import loader

from django.shortcuts import get_object_or_404, render

# from django.utils import simplejson
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

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
    par = Item.objects.get(pk=request.POST['par_id']);
    print(Item.objects.all());
    # TODO: par add child id
    return HttpResponse("Success");

@csrf_exempt
def deletes(request, my_id):
    item = Item.objects.get(pk=my_id)
    if (item.type=="Link") :
        item.delete()
    else :
        print("is folder")
        #recursive delete thru children
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