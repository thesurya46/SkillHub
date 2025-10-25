import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, Users, BookOpen, Calendar, Award, ArrowRight } from 'lucide-react';

export default function Feed({ onNavigate }) {
  const { profile } = useAuth();
  const [recentSkills, setRecentSkills] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [stats, setStats] = useState({ totalSkills: 0, totalProjects: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      const [skillsRes, projectsRes, usersRes] = await Promise.all([
        supabase
          .from('skills')
          .select('*, profiles(full_name, avatar_url, location_city)')
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('community_projects')
          .select('*, profiles(full_name)')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

      if (skillsRes.data) setRecentSkills(skillsRes.data);
      if (projectsRes.data) setRecentProjects(projectsRes.data);

      const totalSkills = await supabase.from('skills').select('id', { count: 'exact', head: true });
      const totalProjects = await supabase.from('community_projects').select('id', { count: 'exact', head: true });

      setStats({
        totalSkills: totalSkills.count || 0,
        totalProjects: totalProjects.count || 0,
        totalUsers: usersRes.count || 0,
      });
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.full_name}!</h2>
        <p className="text-blue-100 text-lg">Your community is growing. Explore new skills and connect with local talent.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen size={28} className="text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Skills</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSkills}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users size={28} className="text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Community Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp size={28} className="text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Recently Added Skills</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentSkills.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No skills added yet</p>
                </div>
              ) : (
                recentSkills.map((skill) => (
                  <div key={skill.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {skill.profiles?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{skill.profiles?.full_name}</p>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{skill.profiles?.location_city || 'Location not set'}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {skill.is_offering ? 'Offering' : 'Seeking'}: <span className="font-medium text-gray-900">{skill.name}</span>
                        </p>
                        <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {skill.category}
                          </span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {skill.skill_level}
                          </span>
                          {skill.hourly_rate_credits > 0 && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              {skill.hourly_rate_credits} credits/hr
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Community Projects</h3>
            </div>
            <div className="p-6 space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No projects yet</p>
                </div>
              ) : (
                recentProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-900 mb-2">{project.title}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">by {project.profiles?.full_name}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'proposed'
                          ? 'bg-yellow-100 text-yellow-700'
                          : project.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-6 border border-blue-200">
            <Award size={32} className="text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">Start Your Journey</h3>
            <p className="text-sm text-gray-600 mb-4">
              Share your skills, learn from others, and become part of a thriving community.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              Explore Skills <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
