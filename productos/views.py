from django.shortcuts import render, HttpResponse, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import http.client
import json
import datetime
import pprint
from .models import Comida
from random import randint
# Create your views here.
def home(request):
    comidas = Comida.objects.all()
    return render(request, "productos/main.html", {"comidas":comidas})

@csrf_exempt
def payPage(request):
    if request.method == 'POST':
        import json
        post_data = json.loads(request.body.decode("utf-8"))

        idDeuda = "demo" + str(randint(1000, 9999) )
        siExiste = "update"
        apiKey = "ap-031c07fd83233b834cfd0e56"
        host = "staging.adamspay.com"
        path = "/api/v1/debts"
        
        # Hora DEBE ser en UTC!
        inicio_validez= datetime.datetime.utcnow().replace()
        fin_validez = inicio_validez + datetime.timedelta(days=1)
        
        # Crear modelo de la deuda
        deuda = {
            "docId": idDeuda,
            "amount": {"currency": "PYG","value": post_data["price"]},
            "label":"Comida",
            "validPeriod":{
            "start":inicio_validez.strftime("%Y-%m-%dT%H:%M:%S"),
            "end":fin_validez.strftime("%Y-%m-%dT%H:%M:%S")
            }  
        }
        
        # El post debe llevar la deuda en la propiedad "debt"
        post = {"debt":deuda}
        
        # Crear JSON
        payload = json.JSONEncoder().encode(post).encode("utf-8")
        
        headers = {"apikey": apiKey, "Content-Type": "application/json", "x-if-exists": siExiste}
        conn = http.client.HTTPSConnection(host)
        conn.request("POST", path , payload, headers)
        
        data = conn.getresponse().read().decode("utf-8")
        response = json.JSONDecoder().decode(data)
        
        # Datos retornan en la propiedad "debt"
        
        pp = pprint.PrettyPrinter(indent=2)
        if "debt" in response:
            debt=response["debt"]
            print("Deuda creada exitosamente")
            print("URL=" + debt["payUrl"])

            return JsonResponse({'message': 'Dato recibido correctamente', "url":debt["payUrl"]})
        else:
            print("# Error")
            if "meta" in response:
                pp.pprint(response["meta"])

                # Devuelve una respuesta JSON si es necesario
                return JsonResponse({'message': 'Dato recibido correctamente'})

            return JsonResponse({'message': 'Error en la solicitud'}, status=400)


