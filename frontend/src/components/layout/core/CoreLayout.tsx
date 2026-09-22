import Header from "./Header.tsx";
import Nav from "./Nav.tsx";

export default function CoreLayout({
  headerTitle = "",
  navUserName = "User",
  children,
}: CoreLayoutProps) {
  return (
    <>
      <Header title={headerTitle} />
      <Nav
        userName={navUserName}
      />
      <main>{children}</main>
    </>
  );
}

interface CoreLayoutProps {
  headerTitle?: string;
  navUserName?: string;
  children: React.ReactNode;
}
