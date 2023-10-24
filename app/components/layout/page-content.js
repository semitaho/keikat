export default function PageContent({ children }) {
  return (
    <main className="flex flex-col items-center justify-between p-10">
      {children}
    </main>
  );
}
