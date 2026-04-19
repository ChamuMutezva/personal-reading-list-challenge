export default function GoalsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 font-lora mb-2">
                        Reading Goals
                    </h1>
                    <p className="text-gray-600">Track and manage your reading objectives</p>
                </div>

                {/* Goals Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Goal Card 1 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Books This Year
                        </h2>
                        <div className="mb-4">
                            <p className="text-3xl font-bold text-blue-600">18/24</p>
                            <p className="text-sm text-gray-500">books completed</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: '75%' }}
                            ></div>
                        </div>
                    </div>

                    {/* Goal Card 2 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Pages This Month
                        </h2>
                        <div className="mb-4">
                            <p className="text-3xl font-bold text-green-600">1,250/1,500</p>
                            <p className="text-sm text-gray-500">pages read</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: '83%' }}
                            ></div>
                        </div>
                    </div>

                    {/* Goal Card 3 */}
                    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            Genres to Explore
                        </h2>
                        <div className="mb-4">
                            <p className="text-3xl font-bold text-purple-600">5/8</p>
                            <p className="text-sm text-gray-500">genres completed</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: '62.5%' }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 font-lora">
                        Reading Statistics
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">42</p>
                            <p className="text-sm text-gray-600">total books</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">8,640</p>
                            <p className="text-sm text-gray-600">total pages</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">7.5</p>
                            <p className="text-sm text-gray-600">avg. rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">12</p>
                            <p className="text-sm text-gray-600">genres read</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}