import { Guitar, Music, Volume2, Palette, Save, Download, Users } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl">
              <Guitar className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to Frettar
          </h1>
          <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            The modern, interactive web application for marking guitar fret positions, designed
            specifically for guitar classes and music education.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Creating
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Guitar className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Interactive Fretboard</h3>
            <p className="text-gray-600 leading-relaxed">
              24-fret guitar fretboard with standard tuning. Click to select/deselect any fret
              position with visual note names and fret markers at traditional positions.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Audio Playback</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time note playback with adjustable duration and volume. Play individual notes or
              all selected frets as a chord with realistic guitar-like synthesis.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Customization</h3>
            <p className="text-gray-600 leading-relaxed">
              Color picker with predefined palette and custom color selection. Add text annotations
              by right-clicking any selected fret for detailed notes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <Save className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Save & Load System</h3>
            <p className="text-gray-600 leading-relaxed">
              Local storage with named configurations. Search and filter saved setups, export/import
              as JSON files, and manage multiple fretboard configurations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
              <Download className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Export Options</h3>
            <p className="text-gray-600 leading-relaxed">
              Download your fretboard as PNG images with custom titles. Perfect for sharing chord
              diagrams, scale patterns, and educational materials.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Educational Focus</h3>
            <p className="text-gray-600 leading-relaxed">
              Perfect for guitar classes and music education. Create chord diagrams, visualize scale
              patterns, show intervals, and combine visual and auditory learning.
            </p>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-white rounded-3xl p-12 shadow-2xl mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Guitar Teachers</h3>
                  <p className="text-gray-600">
                    Create visual aids for lessons, chord charts, and scale diagrams
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Music Students</h3>
                  <p className="text-gray-600">
                    Practice scale patterns, chord progressions, and music theory
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Guitar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Musicians</h3>
                  <p className="text-gray-600">
                    Document song arrangements, share chord progressions, and collaborate
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Content Creators</h3>
                  <p className="text-gray-600">
                    Generate high-quality fretboard diagrams for tutorials and courses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Creating?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of guitar teachers and students who use Frettar to enhance their music
              education experience.
            </p>
            <Link
              to="/"
              className="inline-block px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-lg"
            >
              Launch Frettar Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
