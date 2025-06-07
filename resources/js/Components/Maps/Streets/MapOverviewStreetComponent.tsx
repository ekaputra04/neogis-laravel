import DashboardMapLayout from "@/Layouts/DashboardMapLayout";
import { Head } from "@inertiajs/react";
import { useCallback, useEffect, useState } from "react";
import { decode } from "@mapbox/polyline";
import { centerPoints } from "@/consts/centerPoints";
import DashboardCounterCard from "../DashboardCounterCard";
import { StreetInterface, StreetWithCoordinatesInterface } from "@/types/types";
import { TableStreetFilterCounter } from "./components/TableStreetFilterCounter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import SpatialView from "./components/SpatialView";
import TabularView from "./components/TabularView";
import { toast } from "sonner";
import ChartView from "./components/ChartView";
import MapStreetFullScreen from "./components/MapStreetFullScreen";

const TOKEN = localStorage.getItem("external_api_token") as string;
const API_URL = import.meta.env.VITE_API_URL;

export default function MapOverviewStreetComponent() {
    console.log("PARENT STREET OVERVIEW RENDER");

    const [loading, setLoading] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [streets, setStreets] = useState<StreetWithCoordinatesInterface[]>(
        []
    );
    const [mapCenter, setMapCenter] = useState<[number, number]>([
        centerPoints[0],
        centerPoints[1],
    ]);
    const [mapKey, setMapKey] = useState<number>(0);

    const handleMapCenterChange = useCallback((coords: [number, number]) => {
        setMapCenter(coords);
    }, []);

    const fetchStreets = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/ruasjalan`, {
                headers: { Authorization: `Bearer ${TOKEN}` },
            });
            const { ruasjalan } = await response.json();
            handleMapCenterChange(
                ruasjalan.map((street: StreetInterface) => ({
                    ...street,
                    coordinates: decode(street.paths).map(([lat, lng]) => [
                        lat,
                        lng,
                    ]),
                }))
            );
            setStreets(ruasjalan);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }, []);

    const handleDeleted = useCallback(
        async (streetId: number) => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${API_URL}/ruasjalan/${streetId}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to delete street");
                }

                await fetchStreets();
                toast.success("Street deleted successfully!");
            } catch (error) {
                toast.error("Error deleting street");
            } finally {
                setLoading(false);
            }
        },
        [fetchStreets]
    );

    const handleIsFullScreenChange = useCallback((isFullScreen: boolean) => {
        setIsFullScreen(isFullScreen);
    }, []);

    const handleMapKeyChange = useCallback(() => {
        console.log("MAP KEY CHANGE", mapKey);

        setMapKey((prevKey) => prevKey + 1);
    }, []);

    useEffect(() => {
        const fetchDataStreets = async () => {
            try {
                const response = await fetch(`${API_URL}/ruasjalan`, {
                    headers: { Authorization: `Bearer ${TOKEN}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch locations data");
                }

                const data = await response.json();

                const streets: StreetWithCoordinatesInterface[] = (
                    data.ruasjalan as StreetInterface[]
                ).map((street) => {
                    return {
                        ...street,
                        coordinates: decode(street.paths).map(([lat, lng]) => [
                            lat,
                            lng,
                        ]),
                    };
                });

                setStreets(streets);

                const decoded = decode(data.ruasjalan[0].paths);
                const coordinates = decoded.map(([latitude, longitude]) => ({
                    latitude,
                    longitude,
                }));

                setMapCenter([
                    coordinates[0].latitude,
                    coordinates[1].longitude,
                ]);
            } catch (error) {
                console.error("Error fetching streets data:", error);
            }
        };

        Promise.all([fetchDataStreets()]).catch((error) => {
            console.error("Error fetching initial data:", error);
        });
    }, []);

    return (
        <div>
            <Head title="Street" />

            {isFullScreen ? (
                <MapStreetFullScreen
                    mapKey={mapKey}
                    streets={streets}
                    onDelete={handleDeleted}
                    handleIsFullScreenChange={handleIsFullScreenChange}
                    handleMapKeyChange={handleMapKeyChange}
                />
            ) : (
                <DashboardMapLayout currentPath="/dashboard/street">
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <DashboardCounterCard
                            title="Total Streets"
                            value={streets.length}
                        />
                        <TableStreetFilterCounter
                            title="Eksisting"
                            streets={streets}
                        />
                        <TableStreetFilterCounter
                            title="Jenis"
                            streets={streets}
                        />
                        <TableStreetFilterCounter
                            title="Kondisi"
                            streets={streets}
                        />
                    </div>
                    <hr />
                    <Tabs defaultValue="spatial" className="mt-4 w-full">
                        <div className="flex justify-center mb-8 w-full">
                            <TabsList className="">
                                <TabsTrigger value="spatial">
                                    Spatial View
                                </TabsTrigger>
                                <TabsTrigger value="tabular">
                                    Tabular View
                                </TabsTrigger>
                                <TabsTrigger value="chart">
                                    Chart View
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="spatial">
                            <SpatialView
                                streets={streets}
                                mapCenter={mapCenter}
                                loading={loading}
                                mapKey={mapKey}
                                handleMapCenterChange={handleMapCenterChange}
                                handleDeleted={handleDeleted}
                                handleIsFullScreenChange={
                                    handleIsFullScreenChange
                                }
                                handleMapKeyChange={handleMapKeyChange}
                            />
                        </TabsContent>
                        <TabsContent value="tabular">
                            <TabularView
                                streets={streets}
                                loading={loading}
                                handleDeleted={handleDeleted}
                            />
                        </TabsContent>
                        <TabsContent value="chart">
                            <ChartView streets={streets} />
                        </TabsContent>
                    </Tabs>
                </DashboardMapLayout>
            )}
        </div>
    );
}
