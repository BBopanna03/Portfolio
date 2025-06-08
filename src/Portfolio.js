import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Github, Linkedin, Mail, Phone, MapPin, ExternalLink, Star, Code, Brain, Globe } from 'lucide-react';

const Portfolio = () => {
  const mountRef = useRef(null);
  const starsRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Card flip state
  const [flipped, setFlipped] = useState({
    'AI & Machine Learning': false,
    'Generative AI': false,
    'Web & Development': false,
    'Programming Languages': false,
  });

  // Three.js Setup
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create starfield
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.8
      });

      const starsVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      starsRef.current.push(stars);
    };

    // Create shooting stars
    const createShootingStars = () => {
      const shootingStar = () => {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.8
        });

        const points = [];
        const startX = Math.random() * 1000 - 500;
        const startY = Math.random() * 500 + 200;
        const startZ = Math.random() * 500 - 250;

        for (let i = 0; i < 10; i++) {
          points.push(new THREE.Vector3(
            startX - i * 20,
            startY - i * 15,
            startZ - i * 10
          ));
        }

        geometry.setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        scene.add(line);

        // Animate shooting star
        const animateShootingStar = () => {
          line.position.x -= 5;
          line.position.y -= 3;
          material.opacity -= 0.02;

          if (material.opacity > 0) {
            requestAnimationFrame(animateShootingStar);
          } else {
            scene.remove(line);
          }
        };
        animateShootingStar();
      };

      // Create shooting stars at random intervals
      const shootingStarInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          shootingStar();
        }
      }, 2000);

      return shootingStarInterval;
    };

    createStars();
    const shootingInterval = createShootingStars();

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate stars slowly
      starsRef.current.forEach(stars => {
        stars.rotation.x += 0.0005;
        stars.rotation.y += 0.0005;
      });

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(shootingInterval);
      if (
        mountRef.current &&
        renderer.domElement &&
        mountRef.current.contains(renderer.domElement)
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Skills data
  const skills = {
    'AI & Machine Learning': [
      'Python', 'TensorFlow', 'OpenCV', 'Scikit-learn',
      'NLP', 'Computer Vision', 'MediaPipe', 'PyTesseract'
    ],
    'Generative AI': [
      'Gemini API', 'Llama', 'Mistral', 'Prompt Engineering',
      'LLM Integration', 'Ollama'
    ],
    'Web & Development': [
      'Django', 'REST API', 'MySQL',
      'Git', 'Jupyter'
    ],
    'Programming Languages': [
      'Python', 'Java', 'C'
    ]
  };

  // Card icons
  const cardIcons = {
    'AI & Machine Learning': <Brain className="text-blue-400 mb-3" size={40} />,
    'Generative AI': <Star className="text-purple-400 mb-3" size={40} />,
    'Web & Development': <Globe className="text-orange-400 mb-3" size={40} />,
    'Programming Languages': <Code className="text-green-400 mb-3" size={40} />,
  };

  // Card colors for front face
  const cardColors = {
    'AI & Machine Learning': 'from-gray-800 via-gray-900 to-black',
    'Generative AI': 'from-gray-800 via-gray-900 to-black',
    'Web & Development': 'from-gray-800 via-gray-900 to-black',
    'Programming Languages': 'from-gray-800 via-gray-900 to-black',
  };

  // Flip handler
  const handleFlip = useCallback((category) => {
    setFlipped((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  }, []);

  const projects = [
    {
      title: "Occlusion-Aware Face Recognition",
      description: "Real-time face recognition system using YOLOv8, HOG/CNN encoders with advanced occlusion handling capabilities.",
      tech: ["Python", "YOLOv8", "OpenCV", "Deep Learning"],
      highlights: ["Real-time processing", "Occlusion detection", "Webcam integration"]
    },
    {
      title: "AI Resume Analysis & ATS Optimizer",
      description: "Intelligent resume parsing and scoring system with mock interview generation using Gemini API.",
      tech: ["Python", "Gemini API", "NLP", "OCR"],
      highlights: ["ATS optimization", "Skill matching", "Interview questions"]
    },
    {
      title: "LLM Resume Parser",
      description: "Locally hosted LLM solution for structured resume data extraction with robust error handling.",
      tech: ["Python", "LLM", "JSON", "API"],
      highlights: ["Local hosting", "Rate limiting", "Structured output"]
    }
  ];

  const FloatingParticle = ({ delay }) => (
    <div
      className="absolute w-1 h-1 bg-white rounded-full opacity-60"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `twinkle 4s ease-in-out infinite ${delay}s`
      }}
    />
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black overflow-x-hidden scroll-smooth">
      {/* Three.js Background */}
      <div ref={mountRef} className="fixed inset-0 z-0" />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.2} />
      ))}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-white">
              Bharath<span className="text-cyan-400">.dev</span>
            </div>
            <div className="flex space-x-6">
              {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/80 hover:text-cyan-400 transition-colors duration-200 
                           hover:scale-105 transform font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 relative">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-3 relative z-10">
              BHARATH M
              <span className="block text-lg sm:text-2xl md:text-2xl text-cyan-400 font-light">
                Python & AI/ML Developer
              </span>
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                            blur-3xl rounded-full transform scale-125" />
          </div>

          <p className="text-base sm:text-lg md:text-2xl text-white/80 mb-3 leading-snug">
            <span className="text-white">Building the future, one algorithm at a time!</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a 
              href="mailto:bharathmanjunath03@gmail.com"
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2.5 
                          rounded-full hover:bg-white/20 transition-all duration-300 text-white
                          hover:scale-105 transform border border-white/20">
              <Mail size={18} />
              <span>Get In Touch</span>
            </a>
            <a
  href="#projects"
  className="flex items-center space-x-2 bg-cyan-500/20 backdrop-blur-md px-5 py-2.5 
             rounded-full hover:bg-cyan-500/30 transition-all duration-300 text-cyan-400
             hover:scale-105 transform border border-cyan-400/30"
>
  <Github size={18} />
  <span>View Projects</span>
</a>
          </div>

          <div className="flex justify-center space-x-6 text-white/60">
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>Bengaluru, Karnataka</span>
            </div>
            {/* <div className="flex items-center space-x-2"> */}
              {/* <Phone size={16} /> */}
              {/* <span>+91 861-842-4132</span> */}
            {/* </div> */}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              About <span className="text-cyan-400">Me</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white/80 text-lg leading-relaxed">
              <p>
                I'm a passionate AI/ML Developer currently pursuing my B.E. in Information Science
                and Engineering. My journey in artificial intelligence began with a fascination for
                how machines can understand and interpret our world.
              </p>
              <p>
                Currently working as an AI/ML Intern at WizzyBox, where I've optimized LLM integration
                to reduce latency by 53% and co-developed intelligent interview systems that bridge
                the gap between human resources and artificial intelligence.
              </p>
              <p>
                My expertise spans across computer vision, natural language processing, and generative AI,
                with hands-on experience in building scalable, real-world applications.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10
                              hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="text-cyan-400" size={24} />
                  <h3 className="text-xl font-semibold text-white">Current Focus</h3>
                </div>
                <p className="text-white/70">
                  Specializing in LLM integration, computer vision systems, and building
                  AI-powered applications that solve real-world problems.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10
                              hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <Star className="text-yellow-400" size={24} />
                  <h3 className="text-xl font-semibold text-white">Achievement</h3>
                </div>
                <p className="text-white/70">
                  Reduced LLM latency by 53% at WizzyBox through optimization techniques
                  and efficient system architecture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Technical <span className="text-cyan-400">Arsenal</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <div
                key={category}
                className="mx-auto w-full max-w-sm"
              >
                <div
                  className="relative h-80 cursor-pointer group"
                  onClick={() => handleFlip(category)}
                  style={{ perspective: '1000px' }}
                >
                  <div 
                    className={`relative w-full h-full transition-transform duration-700 preserve-3d ${
                      flipped[category] ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front Face */}
                    <div 
                      className={`absolute inset-0 w-full h-full rounded-2xl shadow-2xl 
                                  bg-gradient-to-br ${cardColors[category]} 
                                  flex flex-col items-center justify-center text-white 
                                  border-2 border-white/20 backface-hidden
                                  hover:shadow-3xl transition-shadow duration-300`}
                    >
                      {cardIcons[category]}
                      <h3 className="text-xl font-bold text-center px-4 mb-2">
                        {category}
                      </h3>
                      <p className="text-sm text-white/80 text-center px-4">
                        Click to view skills
                      </p>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Back Face */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl 
                                 bg-gradient-to-br from-gray-800 via-gray-900 to-black 
                                 flex flex-col items-center justify-center text-white 
                                 border-2 border-cyan-400/50 backface-hidden rotate-y-180 p-4"
                    >
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">
                          {category}
                        </h3>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto scrollbar-hide hover:scrollbar-show">
                          {skillList.map((skill, index) => (
                            <div
                              key={skill}
                              className="px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm 
                                         border border-cyan-400/30 hover:bg-cyan-500/30 transition-colors"
                              style={{
                                animationDelay: `${index * 0.1}s`,
                                animation: 'fadeInUp 0.5s ease-out forwards'
                              }}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-white/60 text-center mt-2">
                        Click to flip back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Featured <span className="text-cyan-400">Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10
                           hover:bg-white/10 transition-all duration-300 hover:scale-105 transform
                           hover:border-cyan-400/30"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: 'slideUp 0.8s ease-out forwards'
                }}
              >
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm
                                 border border-cyan-400/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  {project.highlights.map((highlight, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span className="text-white/80 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => window.open('https://github.com/BBopanna03', '_blank')}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 
                         px-8 py-4 rounded-full text-white font-semibold text-lg
                         hover:from-cyan-600 hover:to-blue-700 transition-all duration-300
                         hover:scale-105 transform shadow-lg hover:shadow-xl"
            >
              <Github size={24} />
              <span>Explore All Projects</span>
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Let's <span className="text-cyan-400">Connect</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
          </div>

          <p className="text-xl text-white/80 mb-12 leading-relaxed">
            Ready to collaborate on innovative AI solutions? Let's build something amazing together.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <a
              href="mailto:bharathmanjunath03@gmail.com"
              className="flex flex-col items-center space-y-4 p-6 bg-white/5 backdrop-blur-md 
                         rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300
                         hover:scale-105 transform group"
            >
              <Mail className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={32} />
              <div>
                <h3 className="text-white font-semibold mb-2">Email</h3>
                <p className="text-white/70 text-sm">bharathmanjunath03@gmail.com</p>
              </div>
            </a>

            <a
              href="https://github.com/BBopanna03"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-4 p-6 bg-white/5 backdrop-blur-md 
                         rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300
                         hover:scale-105 transform group"
            >
              <Github className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={32} />
              <div>
                <h3 className="text-white font-semibold mb-2">GitHub</h3>
                <p className="text-white/70 text-sm">View Projects</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/bharathmanjunath98/"
              className="flex flex-col items-center space-y-4 p-6 bg-white/5 backdrop-blur-md 
                         rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300
                         hover:scale-105 transform group"
            >
              <Linkedin className="text-cyan-400 group-hover:text-cyan-300 transition-colors" size={32} />
              <div>
                <h3 className="text-white font-semibold mb-2">LinkedIn</h3>
                <p className="text-white/70 text-sm">Professional Network</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/60">
            © 2025 Bharath M. Crafted with passion and powered by innovation.
          </p>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Inter', sans-serif;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scroll-smooth {
          scroll-behavior: smooth;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        /* Custom Scrollbar Styles */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .hover\\:scrollbar-show:hover {
          scrollbar-width: thin;
        }
        
        .hover\\:scrollbar-show:hover::-webkit-scrollbar {
          display: block;
          width: 6px;
        }
        
        .hover\\:scrollbar-show:hover::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        
        .hover\\:scrollbar-show:hover::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.6);
          border-radius: 3px;
        }
        
        .hover\\:scrollbar-show:hover::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Portfolio;