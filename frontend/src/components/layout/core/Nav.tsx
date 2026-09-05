
export default function Nav({
  userName,
}: CoreNavProps) {
  return (
    <nav className="navbar-nav">
      <ul className="navbar-nav flex-column justify-content-center p-3">
        <li className="nav-item fw-bold"> Bonjour {userName} </li>
      </ul>
    </nav>
  );
}

interface CoreNavProps {
  userName: string;
}
