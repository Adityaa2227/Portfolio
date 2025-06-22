import React from "react";
import { motion } from "framer-motion";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";

const profiles = [
  {
    name: "LeetCode",
    icon: <SiLeetcode className="text-5xl text-yellow-500 drop-shadow" />,
    username: "aditya2227",
    link: "https://leetcode.com/u/aditya2227/",
    description: (
      <>
        <strong className="text-black dark:text-white">300+ problems solved</strong>. Active in
        contests and consistent daily practice.
      </>
    ),
  },
  {
    name: "Codeforces",
    icon: <SiCodeforces className="text-5xl text-indigo-500 drop-shadow" />,
    username: "Newbie (Max: 1134)",
    link: "https://codeforces.com/profile/aditya2227",
    description: (
      <>
        Regular contest participant with{" "}
        <strong className="text-black dark:text-white">steady rating growth</strong>.
      </>
    ),
  },
  {
    name: "CodeChef",
    icon: <SiCodechef className="text-5xl text-[#5B4638] drop-shadow" />,
    username: "2⭐ (Max: 1303)",
    link: "https://www.codechef.com/users/aditya2227",
    description: (
      <>
        Solving problems and joining{" "}
        <strong className="text-black dark:text-white">monthly rated contests</strong>.
      </>
    ),
  },
];

const CodingProfiles: React.FC = () => {
  return (
    <section className="min-h-screen px-6 py-16 transition-colors duration-300 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black sm:px-12">
      <h2 className="text-4xl font-extrabold text-center text-black mb-14 dark:text-white sm:text-5xl">
        🚀 My Coding Profiles
      </h2>

      <div className="grid max-w-6xl grid-cols-1 gap-10 mx-auto md:grid-cols-3">
        {profiles.map((profile, index) => (
          <motion.a
            key={index}
            href={profile.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="flex flex-col items-center p-8 text-center transition-all duration-300 bg-gray-100 border border-gray-200 shadow-xl cursor-pointer rounded-3xl backdrop-blur-xl dark:bg-white/5 dark:border-white/10 hover:shadow-lg hover:shadow-gray-400/40 dark:hover:shadow-purple-700/50"
          >
            {profile.icon}
            <h3 className="mt-5 text-2xl font-semibold text-black dark:text-white">
              {profile.name}
            </h3>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{profile.username}</p>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {profile.description}
            </p>
            <span className="mt-6 text-sm font-medium text-blue-600 underline dark:text-blue-400 underline-offset-4 hover:text-blue-800 dark:hover:text-blue-300">
              Visit Profile →
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default CodingProfiles;
