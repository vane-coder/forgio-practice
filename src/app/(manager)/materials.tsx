import { useState, type CSSProperties } from "react";

const initialMaterials = [
  {
    id: "1",
    name: "Cotton Fabric",
    status: "Low",
    remaining: "48kg remaining",
  },
  {
    id: "2",
    name: "Polyester Thread",
    status: "OK",
    remaining: "320kg remaining",
  },
  {
    id: "3",
    name: "Dye Chemical",
    status: "Watch",
    remaining: "87L remaining",
  },
];

const statusColor: Record<string, string> = {
  Low: "#e91e8c",
  OK: "#4caf50",
  Watch: "#ff9800",
};

export default function MaterialsScreen() {
  const [search, setSearch] = useState("");
  const [materials, setMaterials] = useState(initialMaterials);

  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Raw Materials</h1>
        <p style={styles.subtitle}>{materials.length} items tracked</p>
      </div>

      <input
        type="search"
        style={styles.search}
        placeholder="Search materials..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div style={styles.list}>
        {filtered.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.icon}>
              <span style={styles.iconText}>📦</span>
            </div>
            <div style={styles.info}>
              <div style={styles.name}>{item.name}</div>
              <div style={styles.bar}>
                <div style={styles.barFill} />
              </div>
              <div style={styles.remaining}>{item.remaining}</div>
            </div>
            <div style={{ ...styles.status, color: statusColor[item.status] }}>
              {item.status}
            </div>
          </div>
        ))}
      </div>

      <button type="button" style={styles.button}>
        + Add material
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fff",
    paddingBottom: 24,
  },
  header: {
    backgroundColor: "#1a237e",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    margin: 0,
  },
  subtitle: {
    color: "#90caf9",
    fontSize: 13,
    margin: "8px 0 0",
  },
  search: {
    display: "block",
    width: "calc(100% - 32px)",
    margin: "16px auto",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 15,
  },
  list: {
    margin: "0 16px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    borderBottom: "1px solid #f0f0f0",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#e3f2fd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  bar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    margin: "4px 0",
  },
  barFill: {
    width: "40%",
    height: "100%",
    backgroundColor: "#1a237e",
    borderRadius: 2,
  },
  remaining: {
    color: "#888",
    fontSize: 12,
  },
  status: {
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 12,
    whiteSpace: "nowrap",
  },
  button: {
    backgroundColor: "#29b6f6",
    margin: "16px",
    padding: 16,
    borderRadius: 10,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: 16,
  },
};
