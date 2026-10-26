import { NavLink, Outlet } from "react-router";

const claseEnlace = ({ isActive }) =>
  isActive ? "enlace activo" : "enlace";

function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink className="brand" to="/" end>
            <span className="brand-mark">A</span>
            AulaTec
          </NavLink>
          <nav className="main-nav" aria-label="Navegación principal">
            <NavLink className={claseEnlace} to="/" end>
              Inicio
            </NavLink>
            <NavLink className={claseEnlace} to="/cursos">
              Cursos
            </NavLink>
            <NavLink className={claseEnlace} to="/matricula">
              Matrícula
            </NavLink>
            <NavLink className={claseEnlace} to="/inscritos">
              Inscritos
            </NavLink>
            <NavLink className={claseEnlace} to="/contacto">
              Contacto
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <span>AulaTec · Portal de cursos y matrícula</span>
          <span>Aprende hoy. Construye lo que sigue.</span>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
