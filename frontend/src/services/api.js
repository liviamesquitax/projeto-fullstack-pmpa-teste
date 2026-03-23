// Importa o axios
import axios from "axios";

// Cria a instância da API
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Exporta a instância
export default api;