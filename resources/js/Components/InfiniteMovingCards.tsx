import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
    return (
        <div className="relative flex flex-col justify-center items-center dark:bg-grid-white/[0.05] rounded-md overflow-hidden antialiased">
            <InfiniteMovingCards
                items={testimonials.splice(0, 6)}
                direction="right"
                speed="slow"
            />
            <InfiniteMovingCards
                items={testimonials.splice(6, 11)}
                direction="left"
                speed="slow"
            />
            {/* <InfiniteMovingCards
                items={testimonials.splice(11, 16)}
                direction="right"
                speed="slow"
            />
            <InfiniteMovingCards
                items={testimonials.splice(16, 20)}
                direction="left"
                speed="slow"
            /> */}
        </div>
    );
}

const testimonials = [
    {
        quote: "This GIS system has revolutionized how we manage road infrastructure in our district. The filtering features saved us hundreds of work hours!",
        name: "Budi Santoso",
        role: "Public Works Director, Banyuwangi",
    },
    {
        quote: "The most user-friendly geospatial platform I've used in 15 years of urban planning. The administrative boundary visualization is exceptional.",
        name: "Sarah Wijaya",
        role: "Urban Planner, Jakarta",
    },
    {
        quote: "Our village road maintenance team now makes data-driven decisions thanks to this system's accurate condition mapping.",
        name: "Dewi Kurnia",
        role: "Village Head, Bali",
    },
    {
        quote: "Implementation reduced our road inventory processing time from 3 weeks to just 2 days. Game-changing efficiency!",
        name: "Michael Chen",
        role: "Infrastructure Analyst, Surabaya",
    },
    {
        quote: "The coordinate search feature helped us locate problematic road sections with pinpoint accuracy during floods.",
        name: "Ahmad Fauzi",
        role: "Disaster Response Coordinator",
    },
    {
        quote: "Finally a GIS tool that understands Indonesia's complex administrative hierarchy. The multi-level filtering is brilliant.",
        name: "Prof. Sri Mulyani",
        role: "Geospatial Researcher, ITB",
    },
    {
        quote: "We cut public complaints about road conditions by 40% after implementing this transparent tracking system.",
        name: "Rina Permata",
        role: "Public Services Manager, Bandung",
    },
    {
        quote: "The mobile-responsive design allows our field teams to update road data in real-time from construction sites.",
        name: "Eko Pratama",
        role: "Field Supervisor",
    },
    {
        quote: "Budget allocation for road repairs became 30% more efficient with this system's condition-based prioritization.",
        name: "David Lim",
        role: "Finance Director",
    },
    {
        quote: "Training time was surprisingly short - our staff mastered the system within a week thanks to the intuitive interface.",
        name: "Lisa Halim",
        role: "Training Coordinator",
    },
    {
        quote: "The API integration allowed seamless connection with our existing asset management database.",
        name: "Raymond Wong",
        role: "IT Manager",
    },
    {
        quote: "Road maintenance planning that used to take months now happens in real-time. A quantum leap for our city!",
        name: "Joko Widodo",
        role: "City Planner, Semarang",
    },
    {
        quote: "Citizen satisfaction scores improved dramatically after we started sharing public road condition maps from this system.",
        name: "Ani Susanti",
        role: "Community Relations",
    },
    {
        quote: "We successfully identified 12 high-accident road segments using the system's historical data analysis.",
        name: "Dr. Bambang S.",
        role: "Traffic Safety Expert",
    },
    {
        quote: "The customizable reports helped us secure Rp 15 billion in additional road maintenance funding from the province.",
        name: "Siti Rahayu",
        role: "Grant Writer",
    },
    {
        quote: "Our contractors now submit digital progress reports directly through the system - no more paperwork headaches!",
        name: "Hendra Kurniawan",
        role: "Project Manager",
    },
    {
        quote: "The system's offline mode was a lifesaver during our remote area road surveys where internet was unreliable.",
        name: "Dian Putra",
        role: "Field Survey Team",
    },
    {
        quote: "For the first time, all 7 departments in our regency are working from the same accurate road dataset.",
        name: "Agus Salim",
        role: "Regency Secretary",
    },
    {
        quote: "The automatic alert system for critical road damage has reduced our emergency response time by 65%.",
        name: "Nurhayati",
        role: "Emergency Services",
    },
    {
        quote: "We've been recognized by the Ministry for having Indonesia's most transparent road management system thanks to this platform.",
        name: "Ir. Wahyudi",
        role: "Head of Public Works",
    },
];
