// Middleware para autorização por nível de acesso (role)
const roleMiddleware = (rolesPermitidas) => {
  return (req, res, next) => {
    // Se não existir usuário no request, bloqueia
    if (!req.user || !req.user.role) {
      return res.status(401).json({ erro: "Usuário não autenticado" });
    }

    // Verifica se a role do usuário está na lista permitida
    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    // Se passou, permite seguir
    next();
  };
};

// Exporta o middleware
module.exports = roleMiddleware;