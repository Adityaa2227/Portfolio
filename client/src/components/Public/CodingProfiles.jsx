import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import api from '../../api/axios';

const CodingProfiles = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
      const fetchProfiles = async () => {
          try {
              const { data } = await api.get('/coding-profiles');
              setProfiles(data);
          } catch (error) {
              console.error('Error fetching profiles:', error);
          }
      };
      fetchProfiles();
  }, []);

  return (
    <section className="py-20 relative text-white">
      <div className="container mx-auto px-6">
        <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                <span>🚀</span> My Coding Profiles
            </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {profiles.map((profile, idx) => (
                <motion.div 
                    key={profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-[#111827] border border-gray-800 rounded-2xl p-8 flex flex-col items-center text-center hover:border-gray-600 transition-colors"
                >
                    <div className="w-16 h-16 mb-6">
                         <img src={profile.icon} alt={profile.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{profile.handle}</p>
                    
                    <p className="font-bold text-white mb-2">{profile.stats}</p>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        {profile.desc}
                    </p>

                    <a 
                        href={profile.link}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm font-semibold group"
                    >
                        Visit Profile
                        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default CodingProfiles;

