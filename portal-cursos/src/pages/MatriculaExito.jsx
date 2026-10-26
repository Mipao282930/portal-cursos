import { Link, Navigate, useLocation } from "react-router";
import { cursos } from "../data/cursos.js";

function MatriculaExito() {
  const location = useLocation();
  const valores = location.state;

  if (!valores) {
    return <Navigate to="/matricula" replace />;
  }

  const curso = cursos.find((elemento) => elemento.id === valores.curso);

  return (
    <section className="success-panel">
      <span className="success-icon" aria-hidden="true">✓</span>
      <p className="eyebrow">Matrícula recibida</p>
      <h1>¡Gracias, {valores.nombre}!</h1>
      <p>Tu solicitud se registró correctamente. Te enviaremos los detalles a {valores.email}.</p>
      <div className="success-summary">
        <strong>Número de matrícula:</strong> {valores.matriculaId}<br />
        <strong>Curso:</strong> {curso?.titulo ?? "Curso seleccionado"}<br />
        <strong>Turno:</strong> {valores.turno}
      </div>
      <Link className="button" to="/cursos">
        Explorar más cursos
      </Link>
    </section>
  );
}

export default MatriculaExito;
