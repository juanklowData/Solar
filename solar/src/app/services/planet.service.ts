import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Planet } from '../interfaces/planet.interface';

@Injectable({ providedIn: 'root' })
export class PlanetService {
  private http = inject(HttpClient);
  private API_URL = 'https://raw.githubusercontent.com/juanklowData/Solar/main/Solar.json';

  getPlanets(): Observable<Planet[]> {
    return this.http.get<{ planets: Planet[] }>(this.API_URL).pipe(
      map(response => response.planets)
    );
  }

  getPlanetById(id: string): Observable<Planet | undefined> {
    return this.getPlanets().pipe(
      map(planets => planets.find(planet => planet.id === id))
    );
  }
}