"use client";
import React from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "motion/react";

export const HeroParallax = ({
    products,
}: {
    products: {
        title: string;
        // link: string;
        thumbnail: string;
    }[];
}) => {
    const firstRow = products.slice(0, 4);
    const secondRow = products.slice(4, 8);
    const thirdRow = products.slice(8, 12);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, 1000]),
        springConfig
    );
    const translateXReverse = useSpring(
        useTransform(scrollYProgress, [0, 1], [0, -1000]),
        springConfig
    );
    const rotateX = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [15, 0]),
        springConfig
    );
    const opacity = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
        springConfig
    );
    const rotateZ = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [20, 0]),
        springConfig
    );
    const translateY = useSpring(
        useTransform(scrollYProgress, [0, 0.2], [-700, 100]),
        springConfig
    );
    return (
        <div
            ref={ref}
            className="relative flex flex-col self-auto py-4 w-screen h-[280vh] md:h-[200vh] lg:h-[400vh] overflow-hidden overflow-x-hidden antialiased [perspective:1000px] [transform-style:preserve-3d]"
        >
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className="w-screen overflow-x-hidden"
            >
                <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse mb-20 w-screen">
                    {firstRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row space-x-20 mb-20">
                    {secondRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateXReverse}
                            key={product.title}
                        />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
                    {thirdRow.map((product) => (
                        <ProductCard
                            product={product}
                            translate={translateX}
                            key={product.title}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export const Header = () => {
    return (
        <div className="top-0 left-0 relative mx-auto px-8 md:px-16 py-20 md:py-40 w-screen max-w-6xl">
            <p className="bg-clip-text bg-gradient-to-b from-black dark:from-white to-gray-300/80 dark:to-slate-900/10 font-semibold text-transparent text-3xl md:text-5xl lG:text-6xl leading-none whitespace-pre-wrap pointer-events-none">
                The Ultimate <br />
                Geographical Information System
            </p>
            <p className="mt-8 max-w-2xl dark:text-neutral-200 text-base md:text-xl">
                A Geographic Information System (GIS) web application for
                mapping and managing road infrastructure data. Features include
                interactive maps, road attribute filtering (road type,
                condition, surface), coordinate-based location search, and
                multi-level administrative boundary visualization (province,
                regency, district, village). Built with modern web technologies
                for responsive and user-friendly spatial data management.
            </p>
        </div>
    );
};

export const ProductCard = ({
    product,
    translate,
}: {
    product: {
        title: string;
        // link: string;
        thumbnail: string;
    };
    translate: MotionValue<number>;
}) => {
    return (
        <motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product relative w-[30rem] h-96 shrink-0"
        >
            <div className="block group-hover/product:shadow-2xl">
                <img
                    src={product.thumbnail}
                    height="600"
                    width="600"
                    className="absolute inset-0 w-full h-full object-cover object-left-top"
                    alt={product.title}
                />
            </div>
            <div className="absolute inset-0 bg-black opacity-0 group-hover/product:opacity-80 w-full h-full pointer-events-none"></div>
            <h2 className="bottom-4 left-4 absolute opacity-0 group-hover/product:opacity-100 text-white">
                {product.title}
            </h2>
        </motion.div>
    );
};
