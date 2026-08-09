import { Eye, EyeOff, Lock, Mail, Search, User, Wallet } from "lucide-react";

export const iconMap = {
  eye: Eye,
  eyeClose: EyeOff,
  mail: Mail,
  lock: Lock,
  user: User,
  search: Search,
  wallet: Wallet,
} as const;

export type IconName = keyof typeof iconMap;
