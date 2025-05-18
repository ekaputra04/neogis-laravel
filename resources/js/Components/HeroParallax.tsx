import { HeroParallax } from "./ui/hero-parallax";
import cartoDBDark from "@/images/map-layer/carto-db-dark.png";
import cartoDBLight from "@/images/map-layer/carto-db-light.png";
import cartoDBVoyager from "@/images/map-layer/carto-db-voyager.png";
import esriWorldImagery from "@/images/map-layer/esri-world-imagery.png";
import googleHybrid from "@/images/map-layer/google-hybrid.png";
import googleSatellite from "@/images/map-layer/google-satellite.png";
import googleStreet from "@/images/map-layer/google-street.png";
import googleTerrain from "@/images/map-layer/google-terrain.png";
import openStreetMapGerman from "@/images/map-layer/open-street-map-german.png";
import openStreetMapHumanitarian from "@/images/map-layer/open-street-map-humanitarian.png";
import openStreetMap from "@/images/map-layer/open-street-map.png";
import openTopoMap from "@/images/map-layer/open-topo-map.png";

export function HeroParallaxDemo() {
    return (
        <div className="w-screen overflow-x-hidden">
            <HeroParallax products={products} />
        </div>
    );
}
export const products = [
    {
        title: "Carto DB Dark",
        thumbnail: cartoDBDark,
    },
    {
        title: "Carto DB Light",
        thumbnail: cartoDBLight,
    },
    {
        title: "Carto DB Voyager",
        thumbnail: cartoDBVoyager,
    },
    {
        title: "Esri World Imagery",
        thumbnail: esriWorldImagery,
    },
    {
        title: "Google Hybrid",
        thumbnail: googleHybrid,
    },
    {
        title: "Google Satelite",
        thumbnail: googleSatellite,
    },
    {
        title: "Google Street",
        thumbnail: googleStreet,
    },
    {
        title: "Google Terrain",
        thumbnail: googleTerrain,
    },
    {
        title: "Open Street Map German",
        thumbnail: openStreetMapGerman,
    },
    {
        title: "Open Street Map Humanitarian",
        thumbnail: openStreetMapHumanitarian,
    },
    {
        title: "Open Street Map",
        thumbnail: openStreetMap,
    },
    {
        title: "Open Topo Map",
        thumbnail: openTopoMap,
    },
];
