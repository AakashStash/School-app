import { useEffect, useState } from 'react';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch('/api/showSchools');
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error('Error fetching schools:', err);
      } finally {
        setLoading(false); // stop loading after fetch
      }
    }
    fetchSchools();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <p>Loading schools...</p>
      </div>
    );
  }

  if (schools.length === 0) {
    return <p>No schools found.</p>;
  }

  return (
    <div className="grid">
      {schools.map((school) => (
        <div key={school.id} className="card">
          <img src={school.image} alt={school.name} className="school-img" />

          <p>
            <span className="label">Name: </span>{school.name}
          </p>
          <p>
            <span className="label">City: </span>{school.city}
          </p>
          <p>
            <span className="label">State: </span>{school.state}
          </p>
          <p>
            <span className="label">Contact Number: </span>{school.contact}
          </p>
          <p>
            <span className="label">Email: </span>{school.email_id}
          </p>
          <p>
            <span className="label">Address: </span>{school.address}
          </p>
        </div>
      ))}
    </div>
  );
}
