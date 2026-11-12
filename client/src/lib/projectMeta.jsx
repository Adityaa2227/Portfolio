import React from 'react';
import {
  SiReact, SiNodedotjs, SiExpress, SiMongodb, SiRedis, SiSocketdotio, SiJsonwebtokens, SiGoogle, SiRazorpay,
  SiNextdotjs, SiTelegram, SiCapacitor, SiJavascript, SiFirebase, SiChakraui, SiOpenstreetmap, SiWordpress,
  SiElementor, SiHtml5, SiCss3, SiBootstrap, SiBitcoin, SiLeetcode,
} from 'react-icons/si';
import {
  Wallet, Briefcase, Bus, ShoppingCart, Code2, BookOpen, Activity, Dice5, Clock, Gamepad2, Sparkles, BarChart3, CreditCard,
} from 'lucide-react';

/** Brand-style icon tile for each project (falls back by category). */
const PROJECT_ICONS = {
  flexpass: { Icon: Wallet, color: '#A78BFA' },
  jobgrid: { Icon: Briefcase, color: '#60A5FA' },
  whereismybitbus: { Icon: Bus, color: '#FBBF24' },
  cryp2sale: { Icon: ShoppingCart, color: '#F472B6' },
  'frontend-code-editor': { Icon: Code2, color: '#A78BFA' },
  'leetcode-replica': { Icon: SiLeetcode, color: '#FFA116' },
  jeevandan: { Icon: BookOpen, color: '#34D399' },
  'bmi-calculator': { Icon: Activity, color: '#F87171' },
  'guess-the-number': { Icon: Dice5, color: '#22D3EE' },
  'digital-clock': { Icon: Clock, color: '#FDBA74' },
  'simon-says-game': { Icon: Gamepad2, color: '#4ADE80' },
};

export const projectIcon = (project, slug) =>
  PROJECT_ICONS[slug] || { Icon: project.category === 'Game' ? Gamepad2 : Code2, color: '#A78BFA' };

export const ProjectIconTile = ({ project, slug, size = 'md' }) => {
  const { Icon, color } = projectIcon(project, slug);
  const box = size === 'lg' ? 'h-16 w-16 rounded-2xl' : size === 'sm' ? 'h-10 w-10 rounded-xl' : 'h-9 w-9 rounded-lg';
  const icon = size === 'lg' ? 30 : size === 'sm' ? 19 : 17;
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center border border-border bg-background/70 ${box}`}
      style={{ color, boxShadow: `0 0 24px -6px ${color}66` }}
    >
      <Icon size={icon} />
    </span>
  );
};

/** Icon + brand colour for a technology name; null when there is no logo. */
const TECH = [
  [/^react/i, SiReact, '#61DAFB'],
  [/^node/i, SiNodedotjs, '#5FA04E'],
  [/^express/i, SiExpress, 'currentColor'],
  [/^mongo/i, SiMongodb, '#47A248'],
  [/^redis/i, SiRedis, '#FF4438'],
  [/^socket/i, SiSocketdotio, 'currentColor'],
  [/^jwt/i, SiJsonwebtokens, '#D63AFF'],
  [/google/i, SiGoogle, '#4285F4'],
  [/razorpay/i, SiRazorpay, '#3395FF'],
  [/^next/i, SiNextdotjs, 'currentColor'],
  [/telegram/i, SiTelegram, '#26A5E4'],
  [/capacitor/i, SiCapacitor, '#119EFF'],
  [/^javascript/i, SiJavascript, '#F7DF1E'],
  [/firebase/i, SiFirebase, '#FFCA28'],
  [/chakra/i, SiChakraui, '#319795'],
  [/openstreetmap/i, SiOpenstreetmap, '#7EBC6F'],
  [/wordpress/i, SiWordpress, '#21759B'],
  [/elementor/i, SiElementor, '#E2498A'],
  [/^html/i, SiHtml5, '#E34F26'],
  [/^css/i, SiCss3, '#1572B6'],
  [/bootstrap/i, SiBootstrap, '#7952B3'],
  [/crypto/i, SiBitcoin, '#F7931A'],
  [/groq|ai$/i, Sparkles, '#F55036'],
  [/recharts/i, BarChart3, '#22B5BF'],
  [/payment/i, CreditCard, '#A78BFA'],
];

export const techIcon = (name) => {
  const hit = TECH.find(([re]) => re.test(name));
  return hit ? { Icon: hit[1], color: hit[2] } : null;
};
