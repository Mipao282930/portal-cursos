const apiBase = import.meta.env.VITE_API_URL ?? "/portal-cursos/api";

export const apiUrl = (resource) => `${apiBase}/${resource.replace(/^\/+/, "")}`;
