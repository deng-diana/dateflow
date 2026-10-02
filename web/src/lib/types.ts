// Types derived from the API's OpenAPI schema. Regenerate with `npm run gen:api`.
// The API returns id and created_at on every record; the schema marks them
// optional only because the same model is used for input.
import type { components } from "./api-types";

type S = components["schemas"];
type Saved<T> = Omit<T, "id" | "created_at"> & {
  id: number;
  created_at: string;
};

export type Task = Saved<S["Task"]>;
export type Message = Saved<S["Message"]>;
export type Memory = Saved<S["Memory"]>;
