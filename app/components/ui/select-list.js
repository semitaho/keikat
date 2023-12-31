export default function SelectList({ id, label, options, onSelect }) {
  return (
    <select 

    id={id}
    onChange={ event => onSelect(event, id )}
    
    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option value="">{label}</option>
      {options.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
    </select>
  );
}
