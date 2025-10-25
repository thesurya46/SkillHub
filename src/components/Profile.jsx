import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Camera, Edit2, MapPin, Mail, Check, X, BookOpen, Plus, Trash2 } from 'lucide-react';

export default function Profile() {
  const { profile, user, updateProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location_city: '',
    location_country: '',
    avatar_url: '',
  });
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  const availableSkills = [
    'Java',
    'Python',
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node.js',
    'SQL',
    'MongoDB',
    'Docker',
    'Kubernetes',
    'AWS',
    'Machine Learning',
    'Data Science',
    'DevOps',
  ];

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location_city: profile.location_city || '',
        location_country: profile.location_country || '',
        avatar_url: profile.avatar_url || '',
      });
      setSkillsToLearn(profile.skills_to_learn || []);
    }
  }, [profile]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    try {
      setUploadingPhoto(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: publicUrl });
      setFormData({ ...formData, avatar_url: publicUrl });
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({ ...formData, skills_to_learn: skillsToLearn });
      setIsEditing(false);
      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      bio: profile.bio || '',
      location_city: profile.location_city || '',
      location_country: profile.location_country || '',
      avatar_url: profile.avatar_url || '',
    });
    setSkillsToLearn(profile.skills_to_learn || []);
    setIsEditing(false);
  };

  const addSkillToLearn = (skill) => {
    if (!skillsToLearn.includes(skill)) {
      setSkillsToLearn([...skillsToLearn, skill]);
    }
    setShowSkillSelector(false);
  };

  const removeSkillToLearn = (skill) => {
    setSkillsToLearn(skillsToLearn.filter((s) => s !== skill));
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-br from-black via-purple-950/50 to-black rounded-2xl shadow-2xl border border-purple-500/20 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-purple-600 to-purple-900 relative overflow-hidden">
          <div className="absolute inset-0 shimmer"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-xl">
                {formData.avatar_url ? (
                  <img
                    src={formData.avatar_url}
                    alt={formData.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {formData.full_name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </label>
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                </div>
              )}
            </div>

            <div className="flex-1 pt-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profile.full_name}
                  </h1>
                  {profile.bio && (
                    <p className="text-purple-200 mb-3">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm text-purple-300">
                    {profile.location_city && (
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>
                          {profile.location_city}
                          {profile.location_country && `, ${profile.location_country}`}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.location_city}
                    onChange={(e) =>
                      setFormData({ ...formData, location_city: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.location_country}
                    onChange={(e) =>
                      setFormData({ ...formData, location_country: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-black/40 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                  <BookOpen size={18} />
                  Skills I Want to Learn
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skillsToLearn.map((skill) => (
                    <div
                      key={skill}
                      className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm font-medium border border-purple-500/30 flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkillToLearn(skill)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowSkillSelector(!showSkillSelector)}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Skill
                  </button>
                </div>

                {showSkillSelector && (
                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <p className="text-sm text-purple-300 mb-2">Select skills you want to learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableSkills
                        .filter((skill) => !skillsToLearn.includes(skill))
                        .map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addSkillToLearn(skill)}
                            className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                          >
                            {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-lg shadow-purple-500/30"
                >
                  <Check size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-white/5 text-purple-200 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 border border-purple-500/20"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {skillsToLearn && skillsToLearn.length > 0 && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen size={20} className="text-purple-400" />
                    Skills I Want to Learn
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsToLearn.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-lg font-medium border border-purple-500/30"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-purple-300 mt-3">
                    Check out AI Recommendations for personalized course suggestions!
                  </p>
                </div>
              )}

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Credits</h3>
                <p className="text-3xl font-bold text-purple-400">{profile.credits || 0}</p>
                <p className="text-sm text-purple-300 mt-1">Available credits for skill exchanges</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
