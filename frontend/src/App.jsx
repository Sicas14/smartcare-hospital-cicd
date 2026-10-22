
import { useState } from "react";
import "./App.css";

const initialPatients = [
  { id: "P001", name: "Aarav Sharma", age: 28, gender: "Male", contact: "9876543210" },
  { id: "P002", name: "Priya Patel", age: 35, gender: "Female", contact: "9876543211" },
  { id: "P003", name: "Rahul Verma", age: 42, gender: "Male", contact: "9876543212" },
  { id: "P004", name: "Ananya Singh", age: 24, gender: "Female", contact: "9876543213" },
];

const doctors = [
  { id: "D001", name: "Dr. Amit Mehta", specialty: "Cardiology", available: true },
  { id: "D002", name: "Dr. Neha Joshi", specialty: "Neurology", available: true },
  { id: "D003", name: "Dr. Raj Malhotra", specialty: "Orthopedics", available: false },
  { id: "D004", name: "Dr. Sneha Rao", specialty: "General Medicine", available: true },
];

const initialAppointments = [
  { id: "A001", patient: "Aarav Sharma", doctor: "Dr. Amit Mehta", date: "2026-10-23", time: "09:30 AM", status: "Confirmed" },
  { id: "A002", patient: "Priya Patel", doctor: "Dr. Neha Joshi", date: "2026-10-23", time: "10:30 AM", status: "Pending" },
  { id: "A003", patient: "Rahul Verma", doctor: "Dr. Sneha Rao", date: "2026-10-24", time: "11:00 AM", status: "Confirmed" },
  { id: "A004", patient: "Ananya Singh", doctor: "Dr. Raj Malhotra", date: "2026-10-24", time: "02:00 PM", status: "Completed" },
];

const navItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Patients", icon: "♙" },
  { name: "Doctors", icon: "✚" },
  { name: "Appointments", icon: "▣" },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [patients, setPatients] = useState(initialPatients);
  const [appointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [patientContact, setPatientContact] = useState("");

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.id} ${patient.contact}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doctor) =>
    `${doctor.name} ${doctor.specialty}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredAppointments = appointments.filter((appointment) =>
    `${appointment.patient} ${appointment.doctor} ${appointment.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function addPatient(event) {
    event.preventDefault();

    const newPatient = {
      id: `P${String(patients.length + 1).padStart(3, "0")}`,
      name: patientName.trim(),
      age: Number(patientAge),
      gender: patientGender,
      contact: patientContact.trim(),
    };

    setPatients([...patients, newPatient]);
    setPatientName("");
    setPatientAge("");
    setPatientGender("Male");
    setPatientContact("");
    setShowPatientForm(false);
    setSearch("");
    setActivePage("Patients");
  }

  function renderDashboard() {
    return (
      <>
        <div className="welcome-banner">
          <div>
            <span className="eyebrow">HOSPITAL OVERVIEW</span>
            <h2>Welcome to SmartCare 👋</h2>
            <p>Here is what's happening at your hospital today.</p>
          </div>
          <div className="banner-icon">✚</div>
        </div>

        <div className="stats-grid">
          <StatCard
            icon="♙"
            label="Total Patients"
            value={patients.length}
            color="blue"
            note="Registered patients"
          />
          <StatCard
            icon="✚"
            label="Total Doctors"
            value={doctors.length}
            color="green"
            note="Medical professionals"
          />
          <StatCard
            icon="▣"
            label="Appointments"
            value={appointments.length}
            color="purple"
            note="Scheduled records"
          />
          <StatCard
            icon="✓"
            label="Available Doctors"
            value={doctors.filter((doctor) => doctor.available).length}
            color="orange"
            note="Currently available"
          />
        </div>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Appointments</h3>
              <p>Review the latest appointment records.</p>
            </div>
            <button
              className="secondary-button"
              onClick={() => {
                setSearch("");
                setActivePage("Appointments");
              }}
            >
              View all
            </button>
          </div>
          <AppointmentTable data={appointments.slice(0, 4)} />
        </section>

        <div className="quick-grid">
          <button
            className="quick-card"
            onClick={() => {
              setSearch("");
              setActivePage("Patients");
              setShowPatientForm(true);
            }}
          >
            <span className="quick-icon blue-bg">＋</span>
            <span><strong>Add a Patient</strong><small>Register a new patient</small></span>
            <span className="quick-arrow">→</span>
          </button>
          <button
            className="quick-card"
            onClick={() => {
              setSearch("");
              setActivePage("Doctors");
            }}
          >
            <span className="quick-icon green-bg">✚</span>
            <span><strong>View Doctors</strong><small>Browse the doctor directory</small></span>
            <span className="quick-arrow">→</span>
          </button>
        </div>
      </>
    );
  }

  function renderPatients() {
    return (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Patient Directory</h3>
            <p>View and manage registered patient records.</p>
          </div>
          <button
            className="primary-button"
            onClick={() => setShowPatientForm(!showPatientForm)}
          >
            {showPatientForm ? "Cancel" : "+ Add Patient"}
          </button>
        </div>

        {showPatientForm && (
          <form className="patient-form" onSubmit={addPatient}>
            <label>
              Full name
              <input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                required
              />
            </label>
            <label>
              Age
              <input
                type="number"
                min="1"
                max="120"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Age"
                required
              />
            </label>
            <label>
              Gender
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value)}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Contact number
              <input
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                placeholder="Contact number"
                pattern="[0-9]{10}"
                title="Enter a 10-digit phone number"
                required
              />
            </label>
            <button className="primary-button form-submit" type="submit">
              Save Patient
            </button>
          </form>
        )}

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Patient ID</th><th>Patient Name</th><th>Age</th><th>Gender</th><th>Contact</th></tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="id-cell">{patient.id}</td>
                  <td><strong>{patient.name}</strong></td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.contact}</td>
                </tr>
              ))}
              {filteredPatients.length === 0 && <EmptyRow columns={5} />}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function renderDoctors() {
    return (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Doctor Directory</h3>
            <p>Medical professionals and their specializations.</p>
          </div>
          <span className="count-chip">{doctors.length} doctors</span>
        </div>
        <div className="doctor-grid">
          {filteredDoctors.map((doctor) => (
            <article className="doctor-card" key={doctor.id}>
              <div className="doctor-avatar">✚</div>
              <div>
                <span className="doctor-id">{doctor.id}</span>
                <h4>{doctor.name}</h4>
                <p>{doctor.specialty}</p>
              </div>
              <span className={`status ${doctor.available ? "confirmed" : "pending"}`}>
                {doctor.available ? "Available" : "Unavailable"}
              </span>
            </article>
          ))}
          {filteredDoctors.length === 0 && <p>No doctors found.</p>}
        </div>
      </section>
    );
  }

  function renderAppointments() {
    return (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Appointment Management</h3>
            <p>Review appointment schedules and statuses.</p>
          </div>
          <span className="count-chip">{appointments.length} records</span>
        </div>
        <AppointmentTable data={filteredAppointments} />
      </section>
    );
  }

  const pageContent = {
    Dashboard: renderDashboard,
    Patients: renderPatients,
    Doctors: renderDoctors,
    Appointments: renderAppointments,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">✚</div>
          <div><strong>SmartCare</strong><small>HOSPITAL MANAGEMENT</small></div>
        </div>

        <div className="nav-label">MAIN MENU</div>
        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${activePage === item.name ? "active" : ""}`}
              onClick={() => {
                setActivePage(item.name);
                setSearch("");
                setShowPatientForm(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
              {item.name === "Appointments" && <span className="nav-count">{appointments.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">?</div>
            <strong>Need help?</strong>
            <p>SmartCare Hospital Management System</p>
          </div>
          <div className="profile">
            <div className="profile-avatar">A</div>
            <div><strong>Admin User</strong><small>Hospital Administrator</small></div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Pages <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-right">
            <span className="system-status"><span className="live-dot" /> System Overview</span>
            <div className="topbar-avatar">A</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-title">
            <div>
              <h1>{activePage}</h1>
              <p>SmartCare Hospital Management System</p>
            </div>
            <div className="today-chip">▦ &nbsp; {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>

          <div className="search-row">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activePage.toLowerCase()}...`}
                aria-label={`Search ${activePage}`}
              />
            </div>
            <span className="secure-label">✦ &nbsp; Care · Connect · Recover</span>
          </div>

          {pageContent[activePage]()}
          <footer>© {new Date().getFullYear()} SmartCare Hospital · Management Dashboard</footer>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, note }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <div className="stat-value">{value}</div>
      <div className="stat-note"><span>●</span> {note}</div>
    </article>
  );
}

function AppointmentTable({ data }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          {data.map((appointment) => (
            <tr key={appointment.id}>
              <td><strong>{appointment.patient}</strong><small className="sub-cell">{appointment.id}</small></td>
              <td>{appointment.doctor}</td>
              <td>{appointment.date}</td>
              <td>{appointment.time}</td>
              <td><span className={`status ${appointment.status.toLowerCase()}`}>{appointment.status}</span></td>
            </tr>
          ))}
          {data.length === 0 && <EmptyRow columns={5} />}
        </tbody>
      </table>
    </div>
  );
}

function EmptyRow({ columns }) {
  return <tr><td colSpan={columns} className="empty-cell">No matching records found.</td></tr>;
}

export default App;
