import { handleDownloadExcel } from "@/lib/utils";
import { StreetWithCoordinatesInterface } from "@/types/types";
import React from "react";

// Komponen React dengan tombol download
const DownloadButton: React.FC<{ data: StreetWithCoordinatesInterface[] }> = ({
    data,
}) => {
    return (
        <button
            onClick={() => handleDownloadExcel(data)}
            style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
            }}
        >
            Download Excel
        </button>
    );
};

export default DownloadButton;
