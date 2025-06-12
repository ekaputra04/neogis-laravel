import { ScaleLoader } from "react-spinners";
import { CSSProperties } from "react";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};

export default function LoadingView() {
    return (
        <div className="top-0 left-0 z-[9999] fixed flex justify-center items-center bg-black opacity-75 w-screen h-screen">
            <ScaleLoader
                color={"#ffffff"}
                loading={true}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
}
