import React from 'react';

export default function ProgressPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Reading Progress</h1>
            <p className="mb-4">Track your reading progress here.</p>
            <div className="space-y-4">
                <div className="border p-4 rounded">
                    <h2 className="font-semibold">Book Title 1</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-sm mt-1">45% complete</p>
                </div>
                <div className="border p-4 rounded">
                    <h2 className="font-semibold">Book Title 2</h2>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <p className="text-sm mt-1">80% complete</p>
                </div>
            </div>
        </div>
    );
}