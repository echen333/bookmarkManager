from django.http import HttpResponse
from django.http import Http404

from django.shortcuts import get_object_or_404, render

from django.http import JsonResponse

def test(request):
    return JsonResponse({"msg":"got it", "a":7})