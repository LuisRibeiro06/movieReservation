interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-red-500 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Try again
                </button>
            )}
        </div>
    );
};

export default ErrorState;