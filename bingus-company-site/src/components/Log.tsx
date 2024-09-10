interface LogProps {
    logDate: Date;
    name: string;
    logPrevious: string;
    logNext: string;
    className?: string;
}

export default function Log({ logDate, name, logPrevious, logNext, className }: LogProps) {
    return (
        <div className={className}>
            <div id="column-names">
                <div>Name</div>
                <div>Date</div>
                <div>Previous Day Log</div>
                <div>Today Log</div>
            </div>
            <div id="column-content">
                <div>{name}</div>
                <div>{logDate.toISOString().split("T")[0]}</div>
                <div>{logPrevious}</div>
                <div>{logNext}</div>
            </div>
        </div>
    );
}