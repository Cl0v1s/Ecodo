import * as Application from './application';

declare var require: (modules: string[], ready: Function, errback: Function) => void;

// Tente de charger du code spécifique à la plateforme à partir du dossier /merges.
// Plus d'informations sur http://taco.visualstudio.com/fr-fr/docs/configure-app/#Content.
require(["./platformOverrides"],
    () => Application.initialize(),
    () => Application.initialize());