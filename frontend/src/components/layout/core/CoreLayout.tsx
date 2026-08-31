import Header from "./Header.tsx";
import Nav from "./Nav.tsx";

export default function CoreLayout({
  headerTitle = "Planificateur Voyages",
  navUserName = "User",
  navlink1 = "Mes Voyages",
  navlink2 = "Destinations",
  children,
}: CoreLayoutProps) {
  return (
    <>
      <Header title={headerTitle} />
      <Nav
        userName={navUserName}
        lienVoyage={navlink1}
        lienDestination={navlink2}
      />
      <main>{children}</main>
    </>
  );
}

interface CoreLayoutProps {
  headerTitle?: string;
  navUserName?: string;
  navlink1?: string;
  navlink2?: string;
  children: React.ReactNode;
}
