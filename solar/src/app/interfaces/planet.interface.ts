export interface Planet {
  id: string;
  name: string;
  englishName: string;
  isPlanet: boolean;
  mass: {
    massValue: number;
    massExponent: number;
  };
  density: number;
  gravity: number;
  meanRadius: number;
  discoveredBy: string;
  discoveryDate: string;
  bodyType: string;
  // Campos adicionales necesarios
  image?: string;        // Para la imagen del planeta
  isFavorite?: boolean;  // Para el manejo de favoritos
  description?: string;  // Para una descripción detallada
  // Campos para animaciones y ordenamiento
  sortIndex?: number;    // Para animar el ordenamiento
  visible?: boolean;     // Para animaciones de entrada/salida
}