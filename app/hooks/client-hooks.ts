import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  return {
    getString: (paramName: string): string => {
      const param = searchParams.get(paramName);
      return param || "";
    },
    getParam: (paramName: string): Set<string> => {
      const param = searchParams.get(paramName);
      if (!param || param === "") {
        return new Set();
      }
      return new Set(param.split(","));
    },

    refreshWithQueryParam(
      param: string,
      value: string | Set<string>
    ): void {
      const urlSearchParams = new URLSearchParams(searchParams);

      if (typeof value === 'string') {
        console.log('ollaanko...', value);

        urlSearchParams.set(param, value as string);
      } else {
        urlSearchParams.set(param, Array.from(value).join(","));
      }
      router.push("/projektit?" + urlSearchParams.toString());
    },
  };
}
