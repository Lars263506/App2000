const Announcement = () => {
    return (
        <div className="p-4 border rounded-lg shadow-md bg-white w-full">
            <h2 className="text-xl font-bold mb-2 text-black">Kunngjøringer</h2>
            <textarea 
                className="p-2 border rounded-md text-black resize overflow-auto min-w-[300px]"
                placeholder="Skriv her..."
            />
        </div>
    );
}

export default Announcement;

