import { useState } from "react";
import { useSearchParams } from "react-router";
import CursoCard from "../components/CursoCard.jsx";
import { cursos } from "../data/cursos.js";

function Cursos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favoritos, setFavoritos] = useState([]);
  const [area, setArea] = useState("Todas");
  const consulta = searchParams.get("q") ?? "";
  const areas = ["Todas", ...new Set(cursos.map((curso) => curso.area))];

  const buscar = (evento) => {
    evento.preventDefault();
    const datos = new FormData(evento.currentTarget);
    const texto = String(datos.get("q") ?? "").trim();
    setSearchParams(texto ? { q: texto } : {});
  };

  const alternarFavorito = (id) => {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((favorito) => favorito !== id)
        : [...actuales, id],
    );
  };

  const cursosVisibles = cursos.filter((curso) => {
    const coincideConsulta = `${curso.titulo} ${curso.descripcion} ${curso.area}`
      .toLocaleLowerCase()
      .includes(consulta.toLocaleLowerCase());
    const coincideArea = area === "Todas" || curso.area === area;
    return coincideConsulta && coincideArea;
  });

  return (
    <>
      <div className="page-heading">
        <p className="eyebrow">Catálogo</p>
        <h1>Encuentra tu próximo curso</h1>
        <p>Explora programas prácticos y elige el que mejor se adapte a ti.</p>
      </div>

      <div className="catalog-toolbar">
        <form className="search-form" onSubmit={buscar}>
          <label className="field-label" htmlFor="busqueda-curso">
            Buscar un curso
            <input
              key={consulta}
              id="busqueda-curso"
              name="q"
              type="search"
              placeholder="Ej. React, diseño..."
              defaultValue={consulta}
            />
          </label>
          <button className="button" type="submit">
            Buscar
          </button>
        </form>
        <div className="filter-field">
          <label htmlFor="filtro-area">Filtrar por área</label>
          <select
            id="filtro-area"
            value={area}
            onChange={(evento) => setArea(evento.target.value)}
          >
            {areas.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="results-note">
        {cursosVisibles.length} {cursosVisibles.length === 1 ? "curso" : "cursos"}
        {favoritos.length > 0 && ` · ${favoritos.length} favoritos`}
      </p>
      {cursosVisibles.length ? (
        <div className="course-grid">
          {cursosVisibles.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              esFavorito={favoritos.includes(curso.id)}
              onToggleFavorito={alternarFavorito}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No encontramos cursos con esos criterios.</p>
          <p>Prueba otra búsqueda o selecciona un área diferente.</p>
        </div>
      )}
    </>
  );
}

export default Cursos;
