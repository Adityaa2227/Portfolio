import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
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
    <section className="py-20 relative text-white overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-500/[0.03] rounded-full blur-[130px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-2">
            Coding <span className="gradient-text-orange">Profiles</span>
          </h2>
          <div className="section-divider" />
          <p className="text-gray-500 mt-6 max-w-lg mx-auto">
            My competitive programming journey across platforms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {profiles.map((profile, idx) => (
            <motion.a
              key={profile._id}
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center group cursor-pointer"
            >
              <div className="w-14 h-14 mb-6 rounded-xl bg-orange-500/10 p-2.5 group-hover:bg-orange-500/20 transition-colors duration-300">
                <img src={profile.icon} alt={profile.name} className="w-full h-full object-contain" />
              </div>

              <h3 className="text-xl font-bold font-heading mb-1 group-hover:text-orange-400 transition-colors duration-300">{profile.name}</h3>
              <p className="text-gray-500 text-sm mb-4 font-mono">{profile.handle}</p>

              <p className="font-semibold text-white mb-1.5 text-lg">{profile.stats}</p>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                {profile.desc}
              </p>

              <div className="flex items-center gap-1.5 text-orange-400 text-sm font-semibold mt-auto">
                <span>Visit Profile</span>
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodingProfiles;
