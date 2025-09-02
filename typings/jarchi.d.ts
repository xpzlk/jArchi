// typings/jarchi.d.ts
/** API jArchi (Nashorn) pour Archi */
declare namespace jArchi {
  /** charge une librairie */
  function load(path: string): void;
  /** convertit un script via la lib ConvertConcept.lib.js */
  function convert(file: string): void;
  // … ajoutez ici les autres fonctions (@see jArchi docs)
}
/** alias global comme jQuery */
declare const $: typeof jArchi;