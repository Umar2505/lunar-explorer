from django.shortcuts import render

def main(request):
    return render(request, 'index.html')

def moon_globe_view(request):
    return render(request, 'moon_globe.html')
