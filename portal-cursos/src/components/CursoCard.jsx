import { Link } from "react-router";

function CursoCard({ curso, esFavorito, onToggleFavorito }) {
  return (
    <article className="course-card">
      <div className="course-card-top">
        <span className="course-icon" aria-hidden="true">
          {curso.icono}
        </span>
        <button
          className="favorite-button"
          type="button"
          aria-label={`${esFavorito ? "Quitar de" : "Agregar a"} favoritos: ${curso.titulo}`}
          aria-pressed={esFavorito}
          onClick={() => onToggleFavorito(curso.id)}
        >
          {esFavorito ? "♥" : "♡"}
        </button>
      </div>
      <span className="course-area">{curso.area}</span>
      <h3>{curso.titulo}</h3>
      <p>{curso.descripcion}</p>
      <div className="course-meta">
        <span>◷ {curso.horas} horas</span>
        <span>⌂ {curso.modalidad}</span>
      </div>
      <Link className="course-card-link" to={`/cursos/${curso.id}`}>
        Ver detalle →
      </Link>
    </article>
  );
}

export default CursoCard;
