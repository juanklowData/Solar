import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetService } from '../../services/planet.service';
import { PlanetCardComponent } from '../planet-card/planet-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Planet } from '../../interfaces/planet.interface';

@Component({
  selector: 'app-planet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlanetCardComponent],
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss']
})
export class PlanetListComponent implements OnInit {
  private planetService = inject(PlanetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  planets = signal<Planet[]>([]); // Lista de planetas
  searchQuery = signal(''); // Búsqueda
  sortOrder = signal<'asc' | 'desc'>('asc'); // Orden
  currentPage = signal(1); // Página actual
  readonly itemsPerPage = 5; // Elementos por página

  filteredPlanets = computed(() => 
    this.planets()
      .filter(p => p.name.toLowerCase().includes(this.searchQuery().toLowerCase())) // Filtra
      .sort((a, b) => this.sortOrder() === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)) // Ordena
      .slice((this.currentPage() - 1) * this.itemsPerPage, this.currentPage() * this.itemsPerPage) // Pagina
  );

  totalPages = computed(() => {
    const total = Math.ceil(
      this.planets().filter(p => p.name.toLowerCase().includes(this.searchQuery().toLowerCase())).length / this.itemsPerPage
    );
    return Array.from({ length: total }, (_, i) => i + 1); // Calcula total de páginas
  });

  ngOnInit() {
    this.loadPlanets();
    this.syncUrlParams();
  }

  private loadPlanets() {
    this.planetService.getPlanets().subscribe({
      next: (data) => this.planets.set(data), // Carga planetas
      error: (err) => console.error('Error loading planets:', err)
    });
  }

  private syncUrlParams() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']); // Sincroniza búsqueda
      if (params['sort']) this.sortOrder.set(params['sort']); // Sincroniza orden
      if (params['page']) this.currentPage.set(Number(params['page'])); // Sincroniza página
    });
  }

  updateSearch(value: string) {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.updateUrlParams();
  }

  toggleSort() {
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc'); // Alterna orden
    this.updateUrlParams();
  }

  private updateUrlParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchQuery(),
        sort: this.sortOrder(),
        page: this.currentPage()
      },
      queryParamsHandling: 'merge' // Mantiene otros params
    });
  }
}
