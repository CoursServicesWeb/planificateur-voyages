interface CoreHeaderProps {
  title: string;
}

export default function Header({ title }: CoreHeaderProps) {
  return (
    <header>
      <div style={headerStyle}>
        <h1>{title}</h1>
      </div>
    </header>
  );
}

const headerStyle = {
  display: "flex",
  padding: "5px",
  border: "1px solid black",
};
