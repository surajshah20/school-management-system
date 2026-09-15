import DashboardLayout from '../components/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-semibold text-gray-800">Dashboard Overview</h2>
      </div>

      {/* Placeholder Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">1,240</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total Teachers</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">84</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Active Classes</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">42</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;