export const Skeleton = ({ className = '' }: { className?: string }) => {
    return (
        <div
            className={`animate-pulse bg-gray-700/50 rounded-md ${className}`}
        />
    );
};
