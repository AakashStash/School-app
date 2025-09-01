import Link from "next/link";

export default function Home() {
  return (
    <div className="cnt">
      <header></header>
    <div className="home">
      <div>
          <h1 className="h-home">Welcome to School App</h1>
          <div className="home">
          <nav className="nav-home " >
            <button className="home-btn pad">
            <Link href="/addSchool" className="home-link">Add School</Link>
          </button>
          <button className="home-btn ">
          <Link href="/showSchools " className="home-link">Show Schools</Link>
          </button>
          </nav>
          </div>
       
      </div>
    </div>
    </div>
  );
}
