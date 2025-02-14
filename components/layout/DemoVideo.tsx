export default function DemoVideo() {
    return (
        <div className='border-none outline-none shadow-xl focus:outline-none '>
            <video
                autoPlay
                loop
                muted
                playsInline
                className='w-full rounded-lg'>
                <source src='/videos/demo.mp4' type='video/mp4' />
            </video>
        </div>
    );
}
