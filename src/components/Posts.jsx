import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  MessageCircle,
  Award,
  ThumbsUp,
  Send,
  Trash2,
  Image as ImageIcon,
  Plus,
  X,
  Upload,
  FileText,
} from 'lucide-react';

export default function Posts() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', post_type: 'general', attachment_url: '' });
  const [commentInputs, setCommentInputs] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(full_name, avatar_url, location_city),
          post_reactions(id, user_id, reaction_type),
          post_comments(id, content, created_at, user_id, profiles(full_name))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const validTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];

    if (!validTypes.includes(fileType)) {
      alert('Please upload only JPEG images or PDF files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return null;

    setUploadingFile(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('post-attachments')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage error:', error);
        if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
          throw new Error('Storage bucket not configured. Please contact support.');
        }
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('post-attachments')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Upload failed: ${error.message || 'Please try again or post without attachment.'}`);
      return null;
    } finally {
      setUploadingFile(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();

    try {
      let attachmentUrl = newPost.attachment_url;

      if (selectedFile) {
        const uploadedUrl = await uploadFile();
        if (uploadedUrl) {
          attachmentUrl = uploadedUrl;
        }
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: newPost.content,
        post_type: newPost.post_type,
        attachment_url: attachmentUrl || '',
      });

      if (error) throw error;

      setNewPost({ content: '', post_type: 'general', attachment_url: '' });
      setSelectedFile(null);
      setShowCreatePost(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      alert(`Failed to create post: ${error.message || 'Please try again.'}`);
    }
  };

  const toggleReaction = async (postId) => {
    try {
      const existingReaction = posts
        .find((p) => p.id === postId)
        ?.post_reactions.find((r) => r.user_id === user.id);

      if (existingReaction) {
        await supabase.from('post_reactions').delete().eq('id', existingReaction.id);
      } else {
        await supabase.from('post_reactions').insert({
          post_id: postId,
          user_id: user.id,
          reaction_type: 'like',
        });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  const addComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content || !content.trim()) return;

    try {
      const { error } = await supabase.from('post_comments').insert({
        post_id: postId,
        user_id: user.id,
        content: content.trim(),
      });

      if (error) throw error;

      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
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
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!showCreatePost ? (
          <button
            onClick={() => setShowCreatePost(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create Post
          </button>
        ) : (
          <form onSubmit={createPost} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New Post</h3>
              <button
                type="button"
                onClick={() => setShowCreatePost(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
              <select
                value={newPost.post_type}
                onChange={(e) => setNewPost({ ...newPost, post_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="qualification">Qualification</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Share your achievement, qualification, or certificate..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File (JPEG or PDF - Max 5MB)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={40} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 text-center">
                    Click to upload JPEG or PDF file
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                </label>
                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedFile.type === 'application/pdf' ? (
                        <FileText size={20} className="text-red-600" />
                      ) : (
                        <ImageIcon size={20} className="text-blue-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm">OR</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachment URL (Optional)
              </label>
              <input
                type="url"
                value={newPost.attachment_url}
                onChange={(e) => setNewPost({ ...newPost, attachment_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/certificate.jpg"
                disabled={!!selectedFile}
              />
            </div>

            <button
              type="submit"
              disabled={uploadingFile}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadingFile ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Uploading...
                </>
              ) : (
                'Post'
              )}
            </button>
          </form>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Award size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share your achievements!</p>
        </div>
      ) : (
        posts.map((post) => {
          const userReacted = post.post_reactions.some((r) => r.user_id === user.id);
          const reactionCount = post.post_reactions.length;
          const isOwnPost = post.user_id === user.id;

          return (
            <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {post.profiles?.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{post.profiles?.full_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleString()}
                      </p>
                    </div>
                    {isOwnPost && (
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete post"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {post.post_type !== 'general' && (
                <div className="mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      post.post_type === 'qualification'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    <Award size={12} className="inline mr-1" />
                    {post.post_type.charAt(0).toUpperCase() + post.post_type.slice(1)}
                  </span>
                </div>
              )}

              <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

              {post.attachment_url && (
                <div className="mb-4">
                  {post.attachment_url.toLowerCase().endsWith('.pdf') ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText size={40} className="text-red-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">PDF Document</p>
                          <p className="text-sm text-gray-600">Click to view or download</p>
                        </div>
                      </div>
                      <a
                        href={post.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <FileText size={18} />
                        View PDF
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={post.attachment_url}
                        alt="Post attachment"
                        className="w-full max-h-96 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4 py-3 border-y border-gray-200 mb-4">
                <button
                  onClick={() => toggleReaction(post.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    userReacted
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp size={18} />
                  <span className="text-sm font-medium">{reactionCount} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-600">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">{post.post_comments.length} Comments</span>
                </div>
              </div>

              <div className="space-y-4">
                {post.post_comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.profiles?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                      <p className="font-medium text-sm text-gray-900">
                        {comment.profiles?.full_name}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {profile?.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addComment(post.id);
                        }
                      }}
                      placeholder="Write a comment..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => addComment(post.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
