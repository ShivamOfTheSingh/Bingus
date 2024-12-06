import "@/public/Loader.css";

interface LoaderProps {
    width: number;
    height: number;
}

export default function Loader({ width, height }: LoaderProps) {
    return (
        <div 
            className="loader" 
            style={{width: `${width}px`, height: `${height}px`}}>
        </div>
    );
}