import React from 'react';

export default function StatisticsPage() {
    // Dummy data for charts
    const booksReadData = [
        { month: 'Jan', count: 5 },
        { month: 'Feb', count: 8 },
        { month: 'Mar', count: 12 },
        { month: 'Apr', count: 7 },
        { month: 'May', count: 10 },
    ];

    const genreData = [
        { genre: 'Fiction', count: 20, color: 'hsl(220, 70%, 50%)' },
        { genre: 'Non-Fiction', count: 15, color: 'hsl(160, 70%, 50%)' },
        { genre: 'Sci-Fi', count: 10, color: 'hsl(290, 70%, 50%)' },
        { genre: 'Biography', count: 5, color: 'hsl(40, 70%, 50%)' },
    ];

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Reading Statistics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart: Books Read per Month */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Books Read per Month</h2>
                    <div className="flex items-end space-x-4">
                        {booksReadData.map((item) => (
                            <div key={item.month} className="text-center">
                                <div
                                    className="bg-blue-500 w-8"
                                    style={{ height: `${item.count * 10}px` }}
                                ></div>
                                <p className="mt-2 text-sm">{item.month}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pie Chart: Genres */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">Books by Genre</h2>
                    <div className="flex flex-col space-y-2">
                        {genreData.map((item) => (
                            <div key={item.genre} className="flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-2"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span>{item.genre}: {item.count}</span>
                            </div>
                        ))}
                    </div>
                    {/* Placeholder for actual pie chart */}
                    <div className="mt-4 text-center text-gray-500">Pie Chart Placeholder</div>
                </div>
            </div>

            {/* Additional Diagram: Reading Progress */}
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Reading Progress</h2>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="mt-2 text-sm">75% of yearly goal completed</p>
            </div>
        </div>
    );
}