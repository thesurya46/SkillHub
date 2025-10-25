import { useState } from 'react';
import { Search, Filter, BookOpen, Code, Play, Award, ChevronRight, X, FileText, Video, Download, Book } from 'lucide-react';

export default function ExploreSkills() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const getStudyMaterials = (moduleId) => {
    return {
      videos: [
        'Introduction and Setup',
        'Core Concepts Explained',
        'Hands-on Practice Session',
        'Advanced Techniques',
        'Real-world Project Demo',
      ],
      documents: [
        'Course PDF Guide',
        'Quick Reference Cheatsheet',
        'Practice Exercises',
        'Code Examples',
        'Additional Resources',
      ],
      articles: [
        'Best Practices Guide',
        'Common Mistakes to Avoid',
        'Performance Tips',
        'Industry Use Cases',
        'Further Reading',
      ],
    };
  };

  const learningModules = {
    java: [
      { id: 1, title: 'Java Basics', description: 'Introduction to Java programming, syntax, and data types', level: 'Beginner', duration: '4 hours', lessons: 12 },
      { id: 2, title: 'Object-Oriented Programming', description: 'Classes, objects, inheritance, and polymorphism', level: 'Beginner', duration: '6 hours', lessons: 15 },
      { id: 3, title: 'Java Collections Framework', description: 'Lists, Sets, Maps, and advanced data structures', level: 'Intermediate', duration: '5 hours', lessons: 10 },
      { id: 4, title: 'Exception Handling', description: 'Try-catch blocks, custom exceptions, and error handling', level: 'Intermediate', duration: '3 hours', lessons: 8 },
      { id: 5, title: 'Multithreading & Concurrency', description: 'Thread creation, synchronization, and parallel processing', level: 'Advanced', duration: '8 hours', lessons: 18 },
      { id: 6, title: 'Java Streams API', description: 'Functional programming with streams and lambda expressions', level: 'Intermediate', duration: '4 hours', lessons: 10 },
      { id: 7, title: 'JDBC & Database Connectivity', description: 'Connecting Java applications to databases', level: 'Intermediate', duration: '5 hours', lessons: 12 },
      { id: 8, title: 'Spring Framework Basics', description: 'Introduction to Spring Boot and dependency injection', level: 'Intermediate', duration: '10 hours', lessons: 20 },
      { id: 9, title: 'RESTful APIs with Spring', description: 'Building REST APIs using Spring Boot', level: 'Advanced', duration: '8 hours', lessons: 16 },
      { id: 10, title: 'Java Design Patterns', description: 'Common design patterns and best practices', level: 'Advanced', duration: '6 hours', lessons: 14 },
      { id: 11, title: 'JUnit & Testing', description: 'Unit testing and test-driven development', level: 'Intermediate', duration: '4 hours', lessons: 9 },
      { id: 12, title: 'Java Performance Optimization', description: 'Memory management and performance tuning', level: 'Advanced', duration: '5 hours', lessons: 11 },
    ],
    python: [
      { id: 13, title: 'Python Fundamentals', description: 'Variables, data types, and basic syntax', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 14, title: 'Control Flow & Functions', description: 'If statements, loops, and function definitions', level: 'Beginner', duration: '4 hours', lessons: 12 },
      { id: 15, title: 'Data Structures in Python', description: 'Lists, tuples, dictionaries, and sets', level: 'Beginner', duration: '5 hours', lessons: 13 },
      { id: 16, title: 'Object-Oriented Python', description: 'Classes, objects, and inheritance', level: 'Intermediate', duration: '6 hours', lessons: 14 },
      { id: 17, title: 'File Handling & I/O', description: 'Reading and writing files, JSON, CSV handling', level: 'Beginner', duration: '3 hours', lessons: 8 },
      { id: 18, title: 'Python Libraries: NumPy', description: 'Numerical computing with NumPy arrays', level: 'Intermediate', duration: '5 hours', lessons: 11 },
      { id: 19, title: 'Python Libraries: Pandas', description: 'Data manipulation and analysis with Pandas', level: 'Intermediate', duration: '6 hours', lessons: 15 },
      { id: 20, title: 'Web Scraping with Python', description: 'BeautifulSoup and Scrapy for web scraping', level: 'Intermediate', duration: '4 hours', lessons: 10 },
      { id: 21, title: 'Django Web Framework', description: 'Building web applications with Django', level: 'Advanced', duration: '12 hours', lessons: 24 },
      { id: 22, title: 'Flask Microframework', description: 'Lightweight web development with Flask', level: 'Intermediate', duration: '6 hours', lessons: 14 },
      { id: 23, title: 'Python for Data Science', description: 'Data analysis, visualization, and machine learning basics', level: 'Advanced', duration: '10 hours', lessons: 20 },
      { id: 24, title: 'Python Async Programming', description: 'Asynchronous programming with asyncio', level: 'Advanced', duration: '5 hours', lessons: 12 },
    ],
    html: [
      { id: 25, title: 'HTML Basics', description: 'Tags, elements, and document structure', level: 'Beginner', duration: '2 hours', lessons: 8 },
      { id: 26, title: 'HTML Forms & Input', description: 'Creating forms and handling user input', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 27, title: 'Semantic HTML5', description: 'Modern HTML5 elements and best practices', level: 'Beginner', duration: '2 hours', lessons: 7 },
      { id: 28, title: 'HTML Tables & Lists', description: 'Creating structured data displays', level: 'Beginner', duration: '2 hours', lessons: 6 },
      { id: 29, title: 'HTML Media Elements', description: 'Images, audio, video, and canvas', level: 'Beginner', duration: '3 hours', lessons: 9 },
      { id: 30, title: 'HTML Accessibility', description: 'ARIA attributes and accessible web design', level: 'Intermediate', duration: '3 hours', lessons: 8 },
      { id: 31, title: 'HTML Meta Tags & SEO', description: 'Optimizing HTML for search engines', level: 'Intermediate', duration: '2 hours', lessons: 6 },
      { id: 32, title: 'HTML5 APIs', description: 'Geolocation, Storage, and Web Workers', level: 'Advanced', duration: '4 hours', lessons: 10 },
    ],
    css: [
      { id: 33, title: 'CSS Basics', description: 'Selectors, properties, and styling fundamentals', level: 'Beginner', duration: '3 hours', lessons: 10 },
      { id: 34, title: 'CSS Box Model', description: 'Margin, padding, border, and content', level: 'Beginner', duration: '2 hours', lessons: 7 },
      { id: 35, title: 'CSS Flexbox Layout', description: 'Flexible box layout for responsive design', level: 'Intermediate', duration: '4 hours', lessons: 12 },
      { id: 36, title: 'CSS Grid Layout', description: 'Advanced grid-based page layouts', level: 'Intermediate', duration: '5 hours', lessons: 14 },
      { id: 37, title: 'CSS Animations & Transitions', description: 'Creating smooth animations and effects', level: 'Intermediate', duration: '4 hours', lessons: 11 },
      { id: 38, title: 'Responsive Web Design', description: 'Media queries and mobile-first approach', level: 'Intermediate', duration: '5 hours', lessons: 13 },
      { id: 39, title: 'CSS Preprocessing (Sass)', description: 'Variables, nesting, and mixins', level: 'Advanced', duration: '4 hours', lessons: 10 },
      { id: 40, title: 'CSS Architecture & BEM', description: 'Organizing and naming CSS classes', level: 'Advanced', duration: '3 hours', lessons: 8 },
      { id: 41, title: 'CSS Custom Properties', description: 'CSS variables and dynamic styling', level: 'Intermediate', duration: '2 hours', lessons: 6 },
      { id: 42, title: 'CSS Performance Optimization', description: 'Optimizing CSS for faster load times', level: 'Advanced', duration: '3 hours', lessons: 9 },
      { id: 43, title: 'Modern CSS Features', description: 'Container queries, :has(), and new selectors', level: 'Advanced', duration: '4 hours', lessons: 11 },
      { id: 44, title: 'CSS Framework: Tailwind', description: 'Utility-first CSS with Tailwind', level: 'Intermediate', duration: '5 hours', lessons: 12 },
    ],
  };

  const categories = [
    { id: 'all', name: 'All Courses', count: Object.values(learningModules).flat().length },
    { id: 'java', name: 'Java', count: learningModules.java.length },
    { id: 'python', name: 'Python', count: learningModules.python.length },
    { id: 'html', name: 'HTML', count: learningModules.html.length },
    { id: 'css', name: 'CSS', count: learningModules.css.length },
  ];

  const getFilteredModules = () => {
    let modules = selectedCategory === 'all'
      ? Object.values(learningModules).flat()
      : learningModules[selectedCategory] || [];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      modules = modules.filter(
        (module) =>
          module.title.toLowerCase().includes(query) ||
          module.description.toLowerCase().includes(query)
      );
    }

    return modules;
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

  const filteredModules = getFilteredModules();

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-br from-purple-900 via-black to-purple-900 rounded-2xl p-8 shadow-2xl border border-purple-500/20">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="float text-purple-400" size={32} />
          <h1 className="text-3xl font-bold text-white">Explore Skills & Learn</h1>
        </div>
        <p className="text-purple-200 mb-6">
          Master programming languages with comprehensive learning modules
        </p>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
          />
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter size={18} className="text-purple-400 flex-shrink-0" />
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap smooth-transition ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : 'bg-white/5 text-purple-200 hover:bg-white/10 border border-purple-500/20'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-purple-300">
        Found <span className="font-semibold text-white">{filteredModules.length}</span> courses
      </div>

      {filteredModules.length === 0 ? (
        <div className="bg-black/40 border border-purple-500/20 rounded-2xl p-12 text-center backdrop-blur-sm">
          <BookOpen size={64} className="mx-auto mb-4 text-purple-500/50" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-purple-300">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module, index) => (
            <div
              key={module.id}
              className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden card-hover cursor-pointer scale-in"
              style={{ animationDelay: `${index * 0.03}s` }}
              onClick={() => {
                setSelectedModule(module);
                setActiveTab('overview');
              }}
            >
              <div className="h-32 bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 shimmer"></div>
                <Code size={48} className="text-white/80 float" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-sm text-purple-200 mb-4 line-clamp-2">{module.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getLevelColor(module.level)}`}>
                    {module.level}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-xs font-medium border border-purple-500/30 flex items-center gap-1">
                    <Award size={12} />
                    {module.lessons} lessons
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-300">{module.duration}</span>
                  <ChevronRight className="text-purple-400" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedModule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in">
          <div className="bg-gradient-to-br from-black via-purple-950/50 to-black border border-purple-500/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scale-in">
            <div className="h-32 bg-gradient-to-br from-purple-600 to-purple-900 relative flex items-center justify-center">
              <Code size={64} className="text-white/80 float" />
              <button
                onClick={() => setSelectedModule(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-lg hover:bg-black/60 smooth-transition border border-purple-500/30"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-4">{selectedModule.title}</h2>
              <p className="text-purple-200 mb-6">{selectedModule.description}</p>

              <div className="flex gap-2 mb-6 border-b border-purple-500/20">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-2 font-medium smooth-transition ${
                    activeTab === 'overview'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-purple-300 hover:text-purple-200'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('materials')}
                  className={`px-4 py-2 font-medium smooth-transition ${
                    activeTab === 'materials'
                      ? 'text-purple-400 border-b-2 border-purple-400'
                      : 'text-purple-300 hover:text-purple-200'
                  }`}
                >
                  Study Materials
                </button>
              </div>

              {activeTab === 'overview' && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-purple-400 text-sm mb-1">Level</div>
                      <div className="text-white font-semibold">{selectedModule.level}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-purple-400 text-sm mb-1">Duration</div>
                      <div className="text-white font-semibold">{selectedModule.duration}</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-purple-400 text-sm mb-1">Lessons</div>
                      <div className="text-white font-semibold">{selectedModule.lessons} modules</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <div className="text-purple-400 text-sm mb-1">Certificate</div>
                      <div className="text-white font-semibold">Yes</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-purple-400 mb-3">What you'll learn</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-purple-200">
                        <Award className="text-green-400 flex-shrink-0 mt-1" size={16} />
                        Master {selectedModule.title.toLowerCase()} concepts
                      </li>
                      <li className="flex items-start gap-2 text-purple-200">
                        <Award className="text-green-400 flex-shrink-0 mt-1" size={16} />
                        Build real-world projects
                      </li>
                      <li className="flex items-start gap-2 text-purple-200">
                        <Award className="text-green-400 flex-shrink-0 mt-1" size={16} />
                        Best practices and industry standards
                      </li>
                      <li className="flex items-start gap-2 text-purple-200">
                        <Award className="text-green-400 flex-shrink-0 mt-1" size={16} />
                        Hands-on coding exercises
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Video className="text-purple-400" size={20} />
                      Video Lectures
                    </h3>
                    <div className="space-y-2">
                      {getStudyMaterials(selectedModule.id).videos.map((video, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:bg-purple-500/20 smooth-transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Play className="text-purple-400" size={18} />
                              <span className="text-purple-200">{video}</span>
                            </div>
                            <span className="text-purple-400 text-sm">
                              {Math.floor(Math.random() * 20 + 10)} min
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <FileText className="text-purple-400" size={20} />
                      Documents & PDFs
                    </h3>
                    <div className="space-y-2">
                      {getStudyMaterials(selectedModule.id).documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:bg-purple-500/20 smooth-transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Download className="text-purple-400" size={18} />
                              <span className="text-purple-200">{doc}</span>
                            </div>
                            <span className="text-purple-400 text-sm">PDF</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Book className="text-purple-400" size={20} />
                      Reading Materials
                    </h3>
                    <div className="space-y-2">
                      {getStudyMaterials(selectedModule.id).articles.map((article, idx) => (
                        <div
                          key={idx}
                          className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 hover:bg-purple-500/20 smooth-transition cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <ChevronRight className="text-purple-400" size={18} />
                              <span className="text-purple-200">{article}</span>
                            </div>
                            <span className="text-purple-400 text-sm">
                              {Math.floor(Math.random() * 10 + 5)} min read
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-500 hover:to-purple-600 smooth-transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
                <Play size={18} />
                Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
