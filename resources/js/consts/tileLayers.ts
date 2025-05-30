export const tileLayers = {
    OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "OpenStreetMap Humanitarian":
        "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    "OpenStreetMap German": "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
    "CartoDB Dark":
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    "Esri World Imagery":
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    OpenTopoMap: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    "CartoDB Light":
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    "CartoDB Voyager":
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    // "Google Satellite": "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    // "Google Streets": "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    // "Google Hybrid": "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    // "Google Terrain": "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
} as const;

export const tileLayerAttributtions = {
    OpenStreetMap:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    "OpenStreetMap Humanitarian":
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>',
    "OpenStreetMap German":
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://openstreetmap.de/">OSM Germany</a>',
    "CartoDB Dark":
        '© <a href="https://carto.com/attributions">CARTO</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    "Esri World Imagery":
        '© <a href="https://www.esri.com/">Esri</a>, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
    OpenTopoMap:
        '© <a href="https://opentopomap.org/about">OpenTopoMap</a> (CC-BY-SA), © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    "CartoDB Light":
        '© <a href="https://carto.com/attributions">CARTO</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    "CartoDB Voyager":
        '© <a href="https://carto.com/attributions">CARTO</a>, © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
} as const;
