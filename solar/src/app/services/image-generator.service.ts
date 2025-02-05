import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  private readonly CACHE_KEY = 'planet_images_cache';

  // Colección de URLs base para imágenes espaciales
  private readonly spaceImageUrls = [
    'https://source.unsplash.com/800x600/?space,planet',
    'https://source.unsplash.com/800x600/?cosmos,galaxy',
    'https://source.unsplash.com/800x600/?universe,stars',
    'https://source.unsplash.com/800x600/?astronomy,nebula'
  ];

  getRandomImage(planetName: string): string {
    // Intentar obtener del cache
    const cachedImage = this.getFromCache(planetName);
    if (cachedImage) {
      return cachedImage;
    }

    // Generar nueva URL
    const randomIndex = Math.floor(Math.random() * this.spaceImageUrls.length);
    const baseUrl = this.spaceImageUrls[randomIndex];
    const uniqueUrl = `${baseUrl}&planet=${planetName}&random=${Date.now()}`;
    
    // Guardar en cache
    this.saveToCache(planetName, uniqueUrl);
    
    return uniqueUrl;
  }

  private getFromCache(planetName: string): string | null {
    try {
      const cache = localStorage.getItem(this.CACHE_KEY);
      if (cache) {
        const images = JSON.parse(cache);
        return images[planetName] || null;
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  }

  private saveToCache(planetName: string, imageUrl: string): void {
    try {
      const cache = localStorage.getItem(this.CACHE_KEY);
      const images = cache ? JSON.parse(cache) : {};
      images[planetName] = imageUrl;
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
}