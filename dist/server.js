"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const CategorieRoutes_1 = __importDefault(require("./routes/CategorieRoutes"));
const CultureRoutes_1 = __importDefault(require("./routes/CultureRoutes"));
const NomPersonnageRoutes_1 = __importDefault(require("./routes/NomPersonnageRoutes"));
const FragmentsHistoireRoutes_1 = __importDefault(require("./routes/FragmentsHistoireRoutes"));
const TitreRoutes_1 = __importDefault(require("./routes/TitreRoutes"));
const ConceptRoutes_1 = __importDefault(require("./routes/ConceptRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/users', userRoutes_1.default);
app.use('/categories', CategorieRoutes_1.default);
app.use('/cultures', CultureRoutes_1.default);
app.use('/nomPersonnages', NomPersonnageRoutes_1.default);
app.use('/fragmentsHistoire', FragmentsHistoireRoutes_1.default);
app.use('/titres', TitreRoutes_1.default);
app.use('/concepts', ConceptRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Notre serveur est lance sur le port ${PORT}`);
});
