const LoadingIndicator = ({ ballSize = 8 }) => {
    return (
        <div className='flex items-center justify-center h-full'>
            <div className='flex space-x-2 justify-center items-center bg-white'>
                <div
                    className={`rounded-full animate-bounce [animation-delay:-0.3s]`}
                    style={{
                        backgroundColor: "rgba(131, 58, 180, 1)",
                        height: ballSize,
                        width: ballSize,
                    }}></div>
                <div
                    className={`rounded-full animate-bounce [animation-delay:-0.15s]`}
                    style={{
                        backgroundColor: "rgba(253, 29, 29, 1)",
                        height: ballSize,
                        width: ballSize,
                    }}></div>
                <div
                    className={`rounded-full animate-bounce`}
                    style={{
                        backgroundColor: "rgba(252, 176, 69, 1)",
                        height: ballSize,
                        width: ballSize,
                    }}></div>
            </div>
        </div>
    );
};

export default LoadingIndicator;
