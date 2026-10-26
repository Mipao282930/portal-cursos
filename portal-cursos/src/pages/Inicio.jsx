import { useState } from "react";
import { Link, useNavigate } from "react-router";
import CursoCard from "../components/CursoCard.jsx";
import { cursos } from "../data/cursos.js";

function Inicio() {
  const navigate = useNavigate();
  const [favoritos, setFavoritos] = useState([]);
  const destacados = cursos.filter((curso) => curso.destacado);

  const alternarFavorito = (id) => {
    setFavoritos((actuales) =>
      actuales.includes(id)
        ? actuales.filter((favorito) => favorito !== id)
        : [...actuales, id],
    );
  };

  return (
    <>
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Tu próximo paso empieza aquí</p>
          <h1>Aprende habilidades para transformar tu futuro.</h1>
          <p>
            Encuentra cursos prácticos, aprende a tu ritmo y prepárate para
            nuevos retos profesionales.
          </p>
          <button
            className="button button-light"
            type="button"
            onClick={() => navigate("/cursos")}
          >
            Ver todos los cursos →
          </button>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit" />
          <span className="hero-book">✦</span>
        </div>
      </section>

      <section aria-labelledby="destacados-titulo">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Empieza por aquí</p>
            <h2 id="destacados-titulo">Cursos destacados</h2>
            <p>Programas pensados para aprender haciendo.</p>
          </div>
          <Link className="text-link" to="/cursos">
            Explorar catálogo →
          </Link>
        </div>
        <div className="course-grid">
          {destacados.map((curso) => (
            <CursoCard
              key={curso.id}
              curso={curso}
              esFavorito={favoritos.includes(curso.id)}
              onToggleFavorito={alternarFavorito}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Inicio;
