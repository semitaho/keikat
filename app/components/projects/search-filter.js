import { useQueryParams } from "@/app/hooks/client-hooks";
import Tag from "./tag";

export default function SearchFilter({ filter, label }) {
  const { getParam, refreshWithQueryParam } = useQueryParams();
  function onRemoveHandler(param) {
    console.log("param to rmeove:", param);
    const currentParams = getParam(filter);
    currentParams.delete(param);
    refreshWithQueryParam(filter, currentParams);
  }
  const paramValues = getParam(filter);
  return (
    paramValues.size > 0 && (
      <div>
        <label>{label}:</label>
        {Array.from(paramValues).map((param) => (
          <Tag key={param} onRemove={onRemoveHandler.bind(this, param)}>
            {param}
          </Tag>
        ))}
      </div>
    )
  );
}
