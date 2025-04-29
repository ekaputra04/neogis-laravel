export const tileLayers = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "Google Satellite": "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  "CartoDB Dark":
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  "Esri World Imagery":
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  "OpenStreetMap Humanitarian":
    "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
  "OpenStreetMap German": "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
  OpenTopoMap: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  "Google Streets": "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  "Google Hybrid": "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  "Google Terrain": "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  "CartoDB Light":
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  "CartoDB Voyager":
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
} as const;
