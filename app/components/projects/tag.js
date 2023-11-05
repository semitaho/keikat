export default function Tag({ children, onRemove }) {
  return (
    <div className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      <span>{children}</span> 
      {onRemove && 
      <button onClick={onRemove} className="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 px-2 rounded">
      X
    </button>
      
      }

    </div>
  );
}
