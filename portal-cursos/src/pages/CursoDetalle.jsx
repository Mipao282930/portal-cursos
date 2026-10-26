import { Link, useNavigate, useParams } from "react-router";
import { cursos } from "../data/cursos.js";

function CursoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const curso = cursos.find((elemento) => elemento.id === id);

  if (!curso) {
    return (
      <section className="not-found-panel">
        <p className="not-found-code">404</p>
        <h1>Curso no encontrado</h1>
        <p>El curso que buscas no está disponible en nuestro catálogo.</p>
        <Link className="button" to="/cursos">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <article className="detail-panel">
      <p className="eyebrow">{curso.area}</p>
      <h1>{curso.icono} {curso.titulo}</h1>
      <p className="detail-description">{curso.descripcion}</p>
      <div className="detail-facts">
        <span className="detail-fact">◷ {curso.horas} horas</span>
        <span className="detail-fact">⌂ {curso.modalidad}</span>
        <span className="detail-fact">Código de curso: {curso.id}</span>
      </div>
      <h2>Temario</h2>
      <ul>
        {curso.temario.map((tema) => (
          <li key={tema}>{tema}</li>
        ))}
      </ul>
      <div className="detail-actions">
        <button
          className="button"
          type="button"
          onClick={() => navigate(`/matricula?curso=${curso.id}`)}
        >
          Matricularme
        </button>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    </article>
  );
}

export default CursoDetalle;
