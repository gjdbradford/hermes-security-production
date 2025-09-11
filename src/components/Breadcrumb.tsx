import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: Array<{
    name: string;
    href?: string;
    current?: boolean;
  }>;
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground/50" />
          {item.current ? (
            <span className="text-foreground font-medium">{item.name}</span>
          ) : (
            <Link to={item.href!} className="hover:text-foreground transition-colors">
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
