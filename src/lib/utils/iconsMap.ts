import {
  Eye,
  EyeOff,
  FileText,
  HardHat,
  Image,
  Layers,
  Lock,
  Mail,
  Search,
  SearchX,
  Tags,
  User,
  Wallet,
} from "lucide-react";

export const iconMap = {
  eye: Eye,
  eyeClose: EyeOff,
  mail: Mail,
  lock: Lock,
  user: User,
  search: Search,
  searchX: SearchX,
  wallet: Wallet,
  fileText: FileText,
  image: Image,
  layers: Layers,
  tags: Tags,
  hardHat: HardHat,
} as const;

export type IconName = keyof typeof iconMap;
