interface LogProps {
    logDate: Date;
    name: string;
    logPrevious: string;
    logNext: string;
    className?: string;
}

export default function Log({ logDate, name, logPrevious, logNext, className }: LogProps) {
    return (
        <div className={`${className} grid grid-cols-4 w-[60rem] border-solid border-black border-2 rounded p-3 gap-y-2 bg-white`}>
            <div className="text-lg font-mono font-semibold">Name</div>
            <div className="text-lg font-mono font-semibold">Date</div>
            <div className="text-lg font-mono font-semibold">Previous Day Log</div>
            <div className="text-lg font-mono font-semibold">Today Log</div>
            <div>{name}</div>
            <div>{logDate.toISOString().split("T")[0]}</div>
            <div>{logPrevious}</div>
            <div>{logNext}</div>
        </div>
    );
}