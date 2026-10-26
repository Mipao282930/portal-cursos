import { Link, useLocation } from "react-router";

function NoEncontrada() {
  const location = useLocation();

  return (
    <section className="not-found-panel">
      <p className="not-found-code">404</p>
      <h1>Página no encontrada</h1>
      <p>
        No encontramos la dirección <code>{location.pathname}</code>.
      </p>
      <Link className="button" to="/">
        Volver al inicio
      </Link>
    </section>
  );
}

export default NoEncontrada;
