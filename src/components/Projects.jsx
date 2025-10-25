import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Plus,
  X,
  MapPin,
  Award,
  Calendar,
  Sparkles,
  TrendingUp,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedProject, setExpandedProject] = useState(null);
  const [projectMatches, setProjectMatches] = useState({});
  const [loadingMatches, setLoadingMatches] = useState({});
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    required_skills: '',
    estimated_credits: '',
    location_city: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('community_projects')
        .select('*, profiles(full_name, location_city)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('community_projects').insert({
        creator_id: user.id,
        title: newProject.title,
        description: newProject.description,
        required_skills: newProject.required_skills.split(',').map((s) => s.trim()),
        estimated_credits: parseInt(newProject.estimated_credits) || 0,
        location_city: newProject.location_city,
        status: 'proposed',
      });

      if (error) throw error;

      setNewProject({
        title: '',
        description: '',
        required_skills: '',
        estimated_credits: '',
        location_city: '',
      });
      setShowCreateModal(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  const fetchAIMatches = async (projectId) => {
    if (projectMatches[projectId]) {
      setExpandedProject(expandedProject === projectId ? null : projectId);
      return;
    }

    setLoadingMatches((prev) => ({ ...prev, [projectId]: true }));
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-skill-matching/match-project`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ project_id: projectId }),
      });

      const result = await response.json();
      if (result.success) {
        setProjectMatches((prev) => ({
          ...prev,
          [projectId]: result.data.matched_skills,
        }));
        setExpandedProject(projectId);
      }
    } catch (error) {
      console.error('Error fetching AI matches:', error);
    } finally {
      setLoadingMatches((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'proposed':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    return 'text-yellow-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Projects</h1>
          <p className="text-gray-600 mt-1">
            Collaborate on meaningful projects with AI-matched volunteers
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Project
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={createProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Community Garden Website"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) =>
                      setNewProject({ ...newProject, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe your project and its goals..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.required_skills}
                    onChange={(e) =>
                      setNewProject({ ...newProject, required_skills: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Web Development, Design, Project Management"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Credits
                    </label>
                    <input
                      type="number"
                      value={newProject.estimated_credits}
                      onChange={(e) =>
                        setNewProject({ ...newProject, estimated_credits: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location City
                    </label>
                    <input
                      type="text"
                      value={newProject.location_city}
                      onChange={(e) =>
                        setNewProject({ ...newProject, location_city: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your city"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Be the first to create a community project!</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create Project
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        by {project.profiles?.full_name}
                      </span>
                      {project.location_city && (
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {project.location_city}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Award size={16} />
                        {project.estimated_credits} credits
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {project.required_skills && project.required_skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => fetchAIMatches(project.id)}
                  disabled={loadingMatches[project.id]}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {loadingMatches[project.id] ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Finding matches...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      {expandedProject === project.id ? 'Hide' : 'Find'} AI-Matched Volunteers
                      {expandedProject === project.id ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </>
                  )}
                </button>
              </div>

              {expandedProject === project.id && projectMatches[project.id] && (
                <div className="border-t border-gray-200 bg-gradient-to-br from-blue-50 to-green-50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-blue-600" size={20} />
                    <h4 className="font-semibold text-gray-900">
                      AI-Matched Volunteers ({projectMatches[project.id].length})
                    </h4>
                  </div>

                  {projectMatches[project.id].length === 0 ? (
                    <p className="text-gray-600 text-center py-4">
                      No matches found yet. Try adjusting the required skills.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {projectMatches[project.id].slice(0, 5).map((match, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {match.profile?.full_name?.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900">
                                  {match.profile?.full_name}
                                </p>
                                <p className="text-sm text-gray-600">{match.skill.name}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                  <span className="capitalize">{match.skill.skill_level}</span>
                                  {match.same_location && (
                                    <span className="flex items-center gap-1 text-green-600">
                                      <MapPin size={12} />
                                      Same Location
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div
                                className={`text-xl font-bold ${getMatchColor(
                                  match.match_score
                                )}`}
                              >
                                {match.match_score}%
                              </div>
                              <div className="text-xs text-gray-500">Match</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
