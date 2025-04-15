import { Particles } from "./magicui/particles";

export function ParticlesBackgroundDark() {
    return (
        <Particles
            className="z-0 absolute inset-0"
            quantity={100}
            ease={80}
            color={"#ffffff"}
            refresh
        />
    );
}
