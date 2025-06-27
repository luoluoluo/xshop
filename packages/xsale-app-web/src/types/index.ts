export interface HeaderItem {
  title: string;
  href?: string;
  items?: {
    title: string;
    href: string;
  }[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}
