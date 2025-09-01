import Link from "next/link";
import { GraduationCap } from "lucide-react"; 

export default function Header() {
  return (
    <header className="header">
    
      <Link href="/" className="logo">
        <GraduationCap size={28} />
        <span>School App</span>
      </Link>

   
      <nav className="nav">
        <Link href="/addSchool" className="nav-link">
          Add School
        </Link>
        <Link href="/showSchools" className="nav-link">
          Show Schools
        </Link>
      </nav>
    </header>
  );
}
