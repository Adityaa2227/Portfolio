import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import io from 'socket.io-client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  Users, Activity, Globe, Smartphone, Clock, ArrowUpRight, Monitor 
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const { logout, admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [liveUsers, setLiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Initial Data
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/analytics/stats');
        setStats(data);
        setLiveUsers(data?.overview?.liveUsers || 0);
      } catch (error) {
        console.error("Failed to load stats", error);
        // Set fallback data so UI doesn't crash
        setStats({
            overview: { totalVisits: 0, uniqueVisitors: 0, bounceRate: 0 },
            charts: { dailyVisits: [], devices: [], countries: [], topPages: [] }
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    // 2. Real-time Live Updates
    const socket = io(SOCKET_URL);
    
    socket.on('connect_error', (err) => {
        console.log("Socket connection failed (Backend might be restarting or offline)");
    });

    socket.on('analytics:liveUpdate', (data) => {
      setLiveUsers(data.liveUsers);
    });

    return () => socket.disconnect();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Analytics...</div>;

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-6">
        <div>
           <h1 className="text-3xl font-bold text-white mb-2">Analytics Overview</h1>
           <p className="text-gray-400 text-sm">Welcome back, {admin?.username}</p>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full animate-pulse-slow">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                <span className="text-green-400 font-mono font-bold">{liveUsers} Live Users</span>
            </div>
            
            <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
                Logout
            </button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
            title="Total Visits" 
            value={stats?.overview?.totalVisits} 
            icon={<Users size={20} className="text-blue-400" />}
            color="bg-blue-500/10 border-blue-500/20"
        />
        <StatCard 
            title="Unique Visitors" 
            value={stats?.overview?.uniqueVisitors} 
            icon={<Activity size={20} className="text-purple-400" />}
            color="bg-purple-500/10 border-purple-500/20"
        />
        <StatCard 
            title="Bounce Rate" 
            value={`${stats?.overview?.bounceRate}%`} 
            icon={<ArrowUpRight size={20} className="text-orange-400" />}
            color="bg-orange-500/10 border-orange-500/20"
        />
        <StatCard 
            title="Avg. Session" 
            value="--:--" 
            icon={<Clock size={20} className="text-green-400" />}
            color="bg-green-500/10 border-green-500/20"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#1E293B]/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-6">Traffic Trend (7 Days)</h3>
              <div className="h-64 w-full">
                {stats?.charts?.dailyVisits?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.charts.dailyVisits}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="_id" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151' }}
                                itemStyle={{ color: '#E5E7EB' }}
                            />
                            <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No traffic data captured yet</div>
                )}
              </div>
          </div>

          <div className="bg-[#1E293B]/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-6">Devices</h3>
              <div className="h-64 w-full">
                {stats?.charts?.devices?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={stats.charts.devices}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="count"
                            >
                                {stats.charts.devices.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No device data</div>
                )}
              </div>
          </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="bg-[#1E293B]/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-6">Top Pages</h3>
              <div className="h-64 w-full">
                {stats?.charts?.topPages?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.charts.topPages} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                            <XAxis type="number" stroke="#9CA3AF" />
                            <YAxis dataKey="_id" type="category" width={150} stroke="#9CA3AF" fontSize={12} />
                            <Tooltip cursor={{fill: '#374151'}} contentStyle={{ backgroundColor: '#111827', border: 'none' }} />
                            <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm">No page view data</div>
                )}
              </div>
          </div>

          <div className="bg-[#1E293B]/50 border border-gray-800 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-white mb-6">Locations</h3>
              <div className="space-y-4">
                  {stats?.charts?.countries.map((country, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <Globe size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-200">{country._id}</span>
                          </div>
                          <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500" 
                                    style={{ width: `${(country.count / stats.overview.totalVisits) * 100}%` }} 
                                  />
                              </div>
                              <span className="text-xs text-gray-400 font-mono">{country.count}</span>
                          </div>
                      </div>
                  ))}
                  {stats?.charts?.countries.length === 0 && (
                      <p className="text-gray-500 text-sm">No location data yet.</p>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl border bg-[#1E293B]/50 border-gray-800 flex items-start justify-between`}>
        <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h4 className="text-2xl font-bold text-white">{value || 0}</h4>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
    </div>
);

export default Dashboard;
