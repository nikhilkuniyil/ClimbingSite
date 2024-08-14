import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{ padding: "1rem", backgroundColor: "#333", color: "white" }}>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem" }}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/climbs">My Climbs</Link>
        </li>
        <li>
          <Link href="/schedule">Schedule Expedition</Link>
        </li>
        <li>
          <Link href="/gallery">Gallery</Link>
        </li>
      </ul>
    </nav>
  );
}
