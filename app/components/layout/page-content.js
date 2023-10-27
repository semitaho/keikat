export default function PageContent({ children }) {
  return (

    <main className="w-full flex justify-center">
      <div className="flex flex-col items-center justify-between p-10 w-5/6">
      {children}
      </div>
    </main>
     
  );
}
