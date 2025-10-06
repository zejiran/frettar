import { Github, Coffee, Send, Music, Code, Guitar } from 'lucide-react';
import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            About Frettar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about the developer behind this project and the music that inspires it
          </p>
        </div>

        {/* Developer Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet the Developer</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  ¡Hola! I'm <strong>Juan Alegría</strong>, a software engineer from Colombia who loves to play
                  electric guitar in my free time. I'm passionate about creating tools that make music
                  education more accessible and engaging.
                </p>
                <p>
                  As someone who enjoys both coding and music, I built Frettar to bridge the gap between
                  technology and guitar education. Whether you're a teacher looking to create visual aids
                  for your classes or a student trying to understand fretboard patterns, this tool is
                  designed with you in mind.
                </p>
                <p>
                  When I'm not writing code or teaching guitar concepts through interactive applications,
                  you can find me jamming to my favorite tracks or exploring new musical genres.
                  Music has always been a driving force in my life, inspiring both my creativity and
                  my approach to problem-solving.
                </p>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://t.me/juanszalegria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                    Telegram
                  </a>
                  <a
                    href="https://github.com/zejiran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors duration-200"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="https://www.buymeacoffee.com/juanszalegria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                  >
                    <Coffee className="w-4 h-4" />
                    Buy me a coffee
                  </a>
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src="https://github.com/zejiran.png"
                  alt="Juan Alegría"
                  className="w-80 h-80 rounded-2xl shadow-2xl object-cover"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                  <Guitar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Built with Modern Technology</h2>
            <p className="text-gray-600">
              Frettar is crafted using cutting-edge web technologies to provide a smooth,
              responsive experience across all devices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">React & TypeScript</h3>
              <p className="text-gray-600">Modern frontend framework with type safety</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Web Audio API</h3>
              <p className="text-gray-600">Real-time audio synthesis for guitar sounds</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Guitar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Music Theory</h3>
              <p className="text-gray-600">Advanced algorithms for note calculation and relationships</p>
            </div>
          </div>
        </div>

        {/* Music Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Music That Inspires Me</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are two playlists that fuel my creativity and keep me motivated while coding.
              From progressive rock to modern metal, these tracks represent the diverse musical
              landscape that influences my work.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Playlist 1 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">My Daily Mix</h3>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/1DW9RN883EqCLAocwGMZrY?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Playlist 2 */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 text-center">Coding Sessions</h3>
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: '12px' }}
                  src="https://open.spotify.com/embed/playlist/3M02OEAsc99OThpzGDqXHc?utm_source=generator"
                  width="100%"
                  height="352"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Music and code go hand in hand for me. These playlists accompany countless hours of
              development and help me stay in the zone while building tools like Frettar.
            </p>
            <div className="flex justify-center">
              <div className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold">
                🎵 Happy listening & coding! 🎸
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
