interface LogProps {
    logDate: Date;
    name: string;
    logPrevious: string;
    logNext: string;
}

export default function Log({ logDate, name, logPrevious, logNext }: LogProps) {
    const date = new Date(logDate);
    return (
        <div>
            Name: {name}
            Date: {date.toISOString()}
            Previous log: {logPrevious}
            Next log: {logNext}
        </div>
    );
}