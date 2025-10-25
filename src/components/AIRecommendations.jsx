import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, BookOpen, Code, Play, Award, ChevronRight, Loader2 } from 'lucide-react';

export default function AIRecommendations({ onNavigate }) {
  const { profile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const allCourses = {
    java: [
      { id: 1, title: 'Java Basics', description: 'Introduction to Java programming, syntax, and data types', level: 'Beginner', duration: '4 hours', lessons: 12 },
      { id: 2, title: 'Object-Oriented Programming', description: 'Classes, objects, inheritance, and polymorphism', level: 'Beginner', duration: '6 hours', lessons: 15 },
      { id: 3, title: 'Java Collections Framework', description: 'Lists, Sets, Maps, and advanced data structures', level: 'Intermediate', duration: '5 hours', lessons: 10 },
      { id: 4, title: 'Spring Framework Basics', description: 'Introduction to Spring Boot and dependency injection', level: 'Intermediate', duration: '10 hours', lessons: 20 },
      { id: 5, title: 'RESTful APIs with Spring', description: 'Building REST APIs using Spring Boot', level: 'Advanced', duration: '8 hours', lessons: 16 },
    ],
    python: [
      { id: 13, title: 'Python Fundamentals', description: 'Variables, data types, and basic syntax', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 14, title: 'Control Flow & Functions', description: 'If statements, loops, and function definitions', level: 'Beginner', duration: '4 hours', lessons: 12 },
      { id: 15, title: 'Data Structures in Python', description: 'Lists, tuples, dictionaries, and sets', level: 'Beginner', duration: '5 hours', lessons: 13 },
      { id: 21, title: 'Django Web Framework', description: 'Building web applications with Django', level: 'Advanced', duration: '12 hours', lessons: 24 },
      { id: 23, title: 'Python for Data Science', description: 'Data analysis, visualization, and machine learning basics', level: 'Advanced', duration: '10 hours', lessons: 20 },
    ],
    html: [
      { id: 25, title: 'HTML Basics', description: 'Tags, elements, and document structure', level: 'Beginner', duration: '2 hours', lessons: 8 },
      { id: 26, title: 'HTML Forms & Input', description: 'Creating forms and handling user input', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 27, title: 'Semantic HTML5', description: 'Modern HTML5 elements and best practices', level: 'Beginner', duration: '2 hours', lessons: 7 },
      { id: 30, title: 'HTML Accessibility', description: 'ARIA attributes and accessible web design', level: 'Intermediate', duration: '3 hours', lessons: 8 },
    ],
    css: [
      { id: 33, title: 'CSS Basics', description: 'Selectors, properties, and styling fundamentals', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 35, title: 'CSS Flexbox Layout', description: 'Flexible box layout for responsive design', level: 'Intermediate', duration: '4 hours', lessons: 12 },
      { id: 36, title: 'CSS Grid Layout', description: 'Advanced grid-based page layouts', level: 'Intermediate', duration: '5 hours', lessons: 14 },
      { id: 37, title: 'CSS Animations & Transitions', description: 'Creating smooth animations and effects', level: 'Intermediate', duration: '4 hours', lessons: 11 },
      { id: 38, title: 'Responsive Web Design', description: 'Media queries and mobile-first approach', level: 'Intermediate', duration: '5 hours', lessons: 13 },
    ],
    javascript: [
      { id: 45, title: 'JavaScript Fundamentals', description: 'Variables, data types, and basic syntax', level: 'Beginner', duration: '4 hours', lessons: 12 },
      { id: 46, title: 'DOM Manipulation', description: 'Working with the Document Object Model', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 47, title: 'Async JavaScript', description: 'Promises, async/await, and fetch API', level: 'Intermediate', duration: '5 hours', lessons: 14 },
      { id: 48, title: 'ES6+ Features', description: 'Modern JavaScript features and syntax', level: 'Intermediate', duration: '4 hours', lessons: 11 },
    ],
    react: [
      { id: 49, title: 'React Basics', description: 'Components, props, and state', level: 'Beginner', duration: '6 hours', lessons: 15 },
      { id: 50, title: 'React Hooks', description: 'useState, useEffect, and custom hooks', level: 'Intermediate', duration: '5 hours', lessons: 13 },
      { id: 51, title: 'React Router', description: 'Navigation and routing in React apps', level: 'Intermediate', duration: '3 hours', lessons: 9 },
    ],
  };

  useEffect(() => {
    generateRecommendations();
  }, [profile]);

  const generateRecommendations = () => {
    setLoading(true);

    const skillsToLearn = profile?.skills_to_learn || [];
    const recs = [];

    skillsToLearn.forEach((skill) => {
      const skillLower = skill.toLowerCase();
      const courses = allCourses[skillLower] || [];

      courses.forEach((course, index) => {
        recs.push({
          skill: skillLower,
          course: course,
          reason: `Based on your interest in ${skill}`,
          priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
          category: skillLower,
        });
      });
    });

    if (recs.length === 0) {
      const defaultSkills = ['javascript', 'python'];
      defaultSkills.forEach((skill) => {
        const courses = allCourses[skill] || [];
        courses.slice(0, 2).forEach((course) => {
          recs.push({
            skill: skill,
            course: course,
            reason: 'Popular course for beginners',
            priority: 'low',
            category: skill,
          });
        });
      });
    }

    setRecommendations(recs);
    setLoading(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Intermediate':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Advanced':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const handleExploreSkills = () => {
    if (onNavigate) {
      onNavigate('explore');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-purple-900 via-black to-purple-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="float text-purple-400" size={32} />
          <h1 className="text-3xl font-bold text-white">AI-Powered Recommendations</h1>
        </div>
        <p className="text-purple-200 mb-4">
          Personalized course suggestions based on your learning goals
        </p>
        {profile?.skills_to_learn && profile.skills_to_learn.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <span className="text-purple-300 text-sm">Learning:</span>
            {profile.skills_to_learn.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-sm font-medium border border-purple-500/30"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <p className="text-purple-300 text-sm mb-2">
              No learning goals set yet. Update your profile to get personalized recommendations!
            </p>
            <button
              onClick={() => onNavigate && onNavigate('profile')}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium underline"
            >
              Go to Profile
            </button>
          </div>
        )}
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
          <Sparkles size={64} className="mx-auto mb-4 text-purple-500/50" />
          <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
          <p className="text-purple-300 mb-4">
            Add skills you want to learn in your profile to get personalized course recommendations
          </p>
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <>
          <div className="text-sm text-purple-300 flex items-center justify-between">
            <span>
              Found <span className="font-semibold text-white">{recommendations.length}</span> recommended courses
            </span>
            <button
              onClick={handleExploreSkills}
              className="text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
            >
              Browse All Courses
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden card-hover cursor-pointer scale-in"
                style={{ animationDelay: `${index * 0.03}s` }}
                onClick={handleExploreSkills}
              >
                <div className="h-32 bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 shimmer"></div>
                  <Code size={48} className="text-white/80 float" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                      {rec.priority === 'high' ? 'Recommended' : rec.priority === 'medium' ? 'Popular' : 'Explore'}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getLevelColor(rec.course.level)}`}>
                      {rec.course.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{rec.course.title}</h3>
                  <p className="text-sm text-purple-200 mb-4 line-clamp-2">{rec.course.description}</p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-purple-300">{rec.course.duration}</span>
                    <span className="text-purple-300 flex items-center gap-1">
                      <Award size={12} />
                      {rec.course.lessons} lessons
                    </span>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-purple-300 text-xs">
                      <Sparkles size={14} />
                      <span>{rec.reason}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-500 hover:to-purple-600 smooth-transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                    <Play size={16} />
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 via-black/50 to-purple-900/50 rounded-2xl p-8 border border-purple-500/20 text-center">
            <BookOpen className="mx-auto mb-4 text-purple-400" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Want to explore more courses?</h3>
            <p className="text-purple-300 mb-4">
              Browse our complete catalog of {Object.values(allCourses).flat().length}+ courses across multiple technologies
            </p>
            <button
              onClick={handleExploreSkills}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30 inline-flex items-center gap-2"
            >
              Explore All Skills
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
