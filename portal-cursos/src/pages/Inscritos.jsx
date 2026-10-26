import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { apiUrl } from "../api.js";

function Inscritos() {
  const [matriculas, setMatriculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");

  const cargarMatriculas = useCallback(async () => {
    const respuesta = await fetch(apiUrl("/matriculas.php"));
    const resultado = await respuesta.json();
    if (!respuesta.ok) {
      throw new Error(resultado.error || "No se pudieron cargar las matrículas.");
    }
    return resultado.matriculas;
  }, []);

  useEffect(() => {
    let vigente = true;
    cargarMatriculas()
      .then((resultado) => {
        if (vigente) setMatriculas(resultado);
      })
      .catch((fallo) => {
        if (vigente) setError(fallo.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [cargarMatriculas]);

  const actualizarMatriculas = async () => {
    setError("");
    setActualizando(true);
    try {
      setMatriculas(await cargarMatriculas());
    } catch (fallo) {
      setError(fallo.message);
    } finally {
      setActualizando(false);
    }
  };

  return (
    <>
      <div className="admin-toolbar">
        <div className="page-heading">
          <p className="eyebrow">Matrículas registradas</p>
          <h1>Personas inscritas</h1>
          <p>{matriculas.length} {matriculas.length === 1 ? "persona inscrita" : "personas inscritas"}</p>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={actualizarMatriculas}
          disabled={actualizando || cargando}
        >
          {actualizando ? "Actualizando..." : "Actualizar lista"}
        </button>
      </div>

      {error && <p className="error-banner" role="alert">{error}</p>}
      {cargando ? (
        <section className="empty-state" role="status">Cargando personas inscritas...</section>
      ) : matriculas.length === 0 ? (
        <section className="empty-state">
          <p>Todavía no hay matrículas guardadas en la base de datos.</p>
          <p>
            Para registrar una, completa el{" "}
            <Link className="text-link" to="/matricula">formulario de matrícula</Link>.
          </p>
        </section>
      ) : (
        <div className="enrollment-table-wrap">
          <table className="enrollment-table">
            <thead>
              <tr>
                <th>N.º</th>
                <th>Nombre</th>
                <th>Curso</th>
                <th>Turno</th>
                <th>Fecha de inscripción</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((matricula) => (
                <tr key={matricula.id}>
                  <td>{matricula.id}</td>
                  <td>{matricula.nombre}</td>
                  <td>{matricula.curso}</td>
                  <td>{matricula.turno}</td>
                  <td>
                    {new Date(matricula.creadoEn.replace(" ", "T")).toLocaleString("es-PE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default Inscritos;
