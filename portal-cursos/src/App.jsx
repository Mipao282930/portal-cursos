import { Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import Inicio from "./pages/Inicio.jsx";
import Cursos from "./pages/Cursos.jsx";
import CursoDetalle from "./pages/CursoDetalle.jsx";
import Matricula from "./pages/Matricula.jsx";
import MatriculaExito from "./pages/MatriculaExito.jsx";
import Contacto from "./pages/Contacto.jsx";
import Inscritos from "./pages/Inscritos.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="cursos" element={<Cursos />} />
        <Route path="cursos/:id" element={<CursoDetalle />} />
        <Route path="matricula" element={<Matricula />} />
        <Route path="matricula/exito" element={<MatriculaExito />} />
        <Route path="inscritos" element={<Inscritos />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
