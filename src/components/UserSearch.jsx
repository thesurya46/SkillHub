import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, MapPin, Award, X, Loader2, Users, Filter, Mail } from 'lucide-react';

export default function UserSearch({ onNavigateToMessages }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users, filterCategory]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          skills(id, name, category, skill_level, is_offering, description)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(query) ||
          user.bio?.toLowerCase().includes(query) ||
          user.location_city?.toLowerCase().includes(query) ||
          user.location_state?.toLowerCase().includes(query) ||
          user.skills?.some((skill) =>
            skill.name.toLowerCase().includes(query) ||
            skill.category.toLowerCase().includes(query)
          )
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((user) =>
        user.skills?.some((skill) => skill.category === filterCategory)
      );
    }

    setFilteredUsers(filtered);
  };

  const categories = [
    'all',
    'Technology',
    'Design',
    'Business',
    'Education',
    'Arts',
    'Health',
    'Home Services',
    'Language',
  ];

  const handleConnect = async () => {
    if (!selectedUser || !user) return;

    if (selectedUser.id === user.id) {
      alert('You cannot message yourself.');
      return;
    }

    setConnecting(true);

    try {
      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('id')
        .or(
          `and(sender_id.eq.${user.id},recipient_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},recipient_id.eq.${user.id})`
        )
        .limit(1);

      if (checkError) throw checkError;

      if (!existingMessages || existingMessages.length === 0) {
        const { error: insertError } = await supabase.from('messages').insert({
          sender_id: user.id,
          recipient_id: selectedUser.id,
          content: `Hi ${selectedUser.full_name}! I'd like to connect with you.`,
        });

        if (insertError) throw insertError;
      }

      setSelectedUser(null);

      if (onNavigateToMessages) {
        onNavigateToMessages();
      }
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Failed to connect. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-gray-900" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-gray-900" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Find People</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Search and connect with talented individuals in your community
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, skill, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter size={18} className="text-gray-600 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterCategory === category
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600 flex items-center justify-between">
        <span>
          Found <span className="font-semibold text-gray-900">{filteredUsers.length}</span> people
        </span>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <Users size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="h-24 bg-gray-900 relative overflow-hidden"></div>
              <div className="p-6 -mt-12">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg border-4 border-white">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.full_name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  {user.location_city && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {user.location_city}
                      {user.location_state && `, ${user.location_state}`}
                    </span>
                  )}
                </div>

                {user.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{user.bio}</p>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-medium border border-gray-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {user.skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-200 text-gray-900 rounded-lg text-xs font-medium">
                          +{user.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs text-gray-600">
                    {user.skills?.length || 0} skills available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-32 bg-gray-900 relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
              >
                <X size={20} className="text-gray-900" />
              </button>
            </div>
            <div className="p-8 -mt-16">
              <div className="w-28 h-28 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-4xl mb-4 shadow-xl border-4 border-white">
                {selectedUser.full_name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedUser.full_name}</h2>
              {selectedUser.location_city && (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin size={18} />
                  <span>
                    {selectedUser.location_city}
                    {selectedUser.location_state && `, ${selectedUser.location_state}`}
                  </span>
                </div>
              )}

              {selectedUser.bio && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                  <p className="text-gray-800">{selectedUser.bio}</p>
                </div>
              )}

              {selectedUser.skills && selectedUser.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Skills</h3>
                  <div className="space-y-3">
                    {selectedUser.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                            <p className="text-sm text-gray-700">{skill.description}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              skill.is_offering
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {skill.is_offering ? 'Offering' : 'Seeking'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Award size={12} />
                            {skill.category}
                          </span>
                          <span className="capitalize">{skill.skill_level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={connecting}
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connecting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Connect & Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
