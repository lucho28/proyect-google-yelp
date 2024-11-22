from fastapi import FastAPI, HTTPException, Request, Form, Query
from typing import Annotated
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from typing import Optional, List
import folium
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

df_modelo = pd.read_csv('datos/datos_filtrados.csv')
df_modelo['city'] = df_modelo['city'].str.lower()
df_modelo['state'] = df_modelo['state'].str.lower()
df_modelo['average_rating'] = df_modelo['average_rating'].round(0).astype(int)
ciudades_florida = df_modelo['city'].unique()
df_florida_filtrado = df_modelo
templateJinja = Jinja2Templates(directory="templates")
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static",StaticFiles(directory="static"), name="static")

@app.get('/',response_class=HTMLResponse)
def read_root(resquest: Request):
    return templateJinja.TemplateResponse("index.html",{
    "request": resquest
    })

@app.get("/map", response_class=HTMLResponse)
async def show_map(
    estado : Optional[str] = Query(default='all'),
    ciudad : Optional[str] = Query(default='all'),
    sentimiento: Optional[str] = Query(default='all'),
    stars: Optional[int] = Query(default=0)
    ):

    
    florida_center = [27.9944024, -81.7602544]  
    zoom_inicial = 7
    #map_obj = folium.Map(location=florida_center, zoom_start=7)

   

    df_florida_filtrado = df_modelo
    df_florida_filtrado = df_florida_filtrado.dropna(subset=['latitude', 'longitude'])
    
    df_florida_filtrado['latitude'] = pd.to_numeric(df_florida_filtrado['latitude'], errors='coerce')
    df_florida_filtrado['longitude'] = pd.to_numeric(df_florida_filtrado['longitude'], errors='coerce')

    if df_florida_filtrado.empty:
        return HTMLResponse(content="No se encontraron datos para los filtros aplicados.", status_code=404)


    if estado != 'all':
        df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['state'] == estado]    
    

    if ciudad != 'all':
        ciudad = ciudad.lower()
        df_florida_filtrado['city'] = df_florida_filtrado['city'].str.strip()
        df_florida_filtrado['city'] = df_florida_filtrado['city'].str.lower()
        df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['city'] == ciudad]

    if sentimiento != 'all':
        sentimiento = sentimiento.lower()
        if sentimiento == 'positivo':
            df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['sentiment'] == 'Positivo']
        elif sentimiento == 'negativo':
            df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['sentiment'] == 'Negativo']
        else:
            df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['sentiment'] == 'Neutro']
     
    if stars > 0:
        df_florida_filtrado = df_florida_filtrado[df_florida_filtrado['average_rating'] == stars]

    #for _, row in df_florida_filtrado.iterrows():
    #    folium.Marker(
    #        location=[row['latitude'], row['longitude']],
    #        popup=f"Nombre: {row['restaurant_name']}<br>Estrellas: {row['average_rating']}",
    #        tooltip=row['restaurant_name']
    #    ).add_to(map_obj)

    ciudad_center = florida_center  # Por defecto, Florida
    if not df_florida_filtrado.empty:
        ciudad_center = [
            df_florida_filtrado['latitude'].mean(),
            df_florida_filtrado['longitude'].mean()
        ]
        zoom_inicial = 12  # Ajustar el nivel de zoom para ciudades más pequeñas

    # Crear el mapa centrado en las coordenadas calculadas
    map_obj = folium.Map(location=ciudad_center, zoom_start=zoom_inicial)

    for _, row in df_florida_filtrado.iterrows():
        popup = f"""
        <div style="color: white; background-color: #2a9d8f; padding: 5px; border-radius: 5px;">
            <strong>Nombre:</strong> {row['restaurant_name']}<br>
            <strong>Estrellas:</strong> {row['average_rating']}
        </div>
        """
        
        if row['sentiment'] == 'Positivo':
            color_punto = 'green'
        elif row['sentiment'] == 'Negativo':
            color_punto = 'red'
        else:
            color_punto = 'blue'

        folium.Marker(
            location=[row['latitude'], row['longitude']],
            popup=folium.Popup(popup, max_width=300),
            tooltip=row['restaurant_name'],
            icon=folium.Icon(color=color_punto)
        ).add_to(map_obj) 

    return HTMLResponse(content=map_obj._repr_html_())
    

@app.get("/estados")
async def get_estados():
    
    estados = df_modelo['state'].unique().tolist()

    # Filtra los valores NaN 
    estados = [estado for estado in estados if isinstance(estado, str) and not pd.isna(estado)]

    estados = [estado.title() for estado in estados] 

    return estados


@app.get("/ciudades/{estado}", response_model=List[str])
async def get_ciudades(estado: str):
    # Filtra las ciudades por estado
    estado = estado.lower()
    ciudades = df_florida_filtrado[df_florida_filtrado['state'] == estado]['city'].dropna().unique().tolist()
    
    # Filtra cualquier valor NaN de la lista de ciudades y verifica que sea una cadena de texto
    ciudades = [ciudad for ciudad in ciudades if isinstance(ciudad, str) and not pd.isna(ciudad)]

    if not ciudades:
        raise HTTPException(status_code=404, detail="Ciudades no encontradas para este estado")
    
    ciudades = [ciudad.title() for ciudad in ciudades] 

    return ciudades


@app.get("/resumen", response_class=HTMLResponse)
async def summary_star(request: Request):
    # Página con el resumen de estrellas
    return templateJinja.TemplateResponse("resumen.html", {"request": request})

@app.get("/quienes_somos", response_class=HTMLResponse)
async def summary_star(request: Request):
    # Página con el resumen de estrellas
    return templateJinja.TemplateResponse("quienessomos.html", {"request": request})

@app.get("/contacto", response_class=HTMLResponse)
async def summary_star(request: Request):
    # Página con el resumen de estrellas
    return templateJinja.TemplateResponse("contacto.html", {"request": request})