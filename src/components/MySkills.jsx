import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export default function MySkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology',
    skill_level: 'intermediate',
    is_offering: true,
    hourly_rate_credits: 0,
  });

  const categories = ['Technology', 'Design', 'Business', 'Arts & Crafts', 'Fitness', 'Language', 'Music', 'Cooking', 'Education', 'Other'];

  useEffect(() => {
    fetchMySkills();
  }, [user]);

  const fetchMySkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingSkill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert([{ ...formData, user_id: user.id }]);
        if (error) throw error;
      }
      setShowModal(false);
      setEditingSkill(null);
      setFormData({ name: '', description: '', category: 'Technology', skill_level: 'intermediate', is_offering: true, hourly_rate_credits: 0 });
      fetchMySkills();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      fetchMySkills();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      category: skill.category,
      skill_level: skill.skill_level,
      is_offering: skill.is_offering,
      hourly_rate_credits: skill.hourly_rate_credits,
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Skills</h2>
        <button onClick={() => { setShowModal(true); setEditingSkill(null); setFormData({ name: '', description: '', category: 'Technology', skill_level: 'intermediate', is_offering: true, hourly_rate_credits: 0 }); }} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus size={20} />
          Add Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No skills added yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first skill</p>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Add Skill</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${skill.is_offering ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {skill.is_offering ? 'Offering' : 'Seeking'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{skill.category}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{skill.skill_level}</span>
                    {skill.hourly_rate_credits > 0 && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">{skill.hourly_rate_credits} credits/hr</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(skill)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">{editingSkill ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g., Python Programming" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                  <select value={formData.skill_level} onChange={(e) => setFormData({ ...formData, skill_level: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select value={formData.is_offering} onChange={(e) => setFormData({ ...formData, is_offering: e.target.value === 'true' })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="true">Offering</option>
                    <option value="false">Seeking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rate (credits/hour)</label>
                  <input type="number" min="0" value={formData.hourly_rate_credits} onChange={(e) => setFormData({ ...formData, hourly_rate_credits: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">{editingSkill ? 'Update' : 'Add'} Skill</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
