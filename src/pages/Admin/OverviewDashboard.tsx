
import React from 'react';
import { BookOpen, Layers, FileText, HelpCircle, Globe, Users, TrendingUp, Clock, Award, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/reusable-components/card';
import { Badge } from '@/components/reusable-components/badge';

const OverviewDashboard = () => {
  // Mock data for the overview
  const stats = [
    { label: 'Total Courses', value: 12, icon: BookOpen, color: 'from-purple-500 to-pink-500', change: '+2 this month' },
    { label: 'Active Modules', value: 45, icon: Layers, color: 'from-blue-500 to-cyan-500', change: '+8 this month' },
    { label: 'Learning Parts', value: 128, icon: FileText, color: 'from-green-500 to-emerald-500', change: '+15 this week' },
    { label: 'Total Questions', value: 342, icon: HelpCircle, color: 'from-orange-500 to-red-500', change: '+23 this week' },
    { label: 'Languages', value: 8, icon: Globe, color: 'from-indigo-500 to-purple-500', change: '+1 this month' },
    { label: 'Active Users', value: 1247, icon: Users, color: 'from-pink-500 to-rose-500', change: '+89 this week' },
  ];

  const recentActivity = [
    { action: 'New course created', item: 'Advanced Spanish Grammar', time: '2 hours ago', type: 'course' },
    { action: 'Module updated', item: 'Basic Greetings', time: '4 hours ago', type: 'module' },
    { action: 'Questions added', item: 'Common Phrases Practice', time: '6 hours ago', type: 'question' },
    { action: 'User registered', item: 'john.doe@example.com', time: '8 hours ago', type: 'user' },
    { action: 'Language activated', item: 'Portuguese', time: '1 day ago', type: 'language' },
  ];

  const topPerformers = [
    { name: 'Spanish Fundamentals', type: 'Course', users: 456, completion: 92 },
    { name: 'French Basics', type: 'Course', users: 324, completion: 88 },
    { name: 'German Grammar', type: 'Course', users: 289, completion: 85 },
    { name: 'Italian Conversation', type: 'Course', users: 201, completion: 90 },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'module': return Layers;
      case 'question': return HelpCircle;
      case 'user': return Users;
      case 'language': return Globe;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-purple-100 text-purple-800';
      case 'module': return 'bg-blue-100 text-blue-800';
      case 'question': return 'bg-orange-100 text-orange-800';
      case 'user': return 'bg-pink-100 text-pink-800';
      case 'language': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800">Dashboard Overview</h2>
            <p className="text-gray-600">Monitor your learning platform performance</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-2xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-gray-800">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-gray-800">Recent Activity</CardTitle>
                <CardDescription>Latest updates and changes</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={index} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-gray-100 rounded-xl">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.item}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-black text-gray-800">Top Performing Courses</CardTitle>
                <CardDescription>Highest engagement and completion rates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{course.name}</p>
                  <p className="text-xs text-gray-600">{course.users} enrolled students</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-600">{course.completion}%</span>
                  </div>
                  <span className="text-xs text-gray-500">completion</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
