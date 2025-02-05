import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanetService } from '../../services/planet.service';
import { PlanetCardComponent } from '../planet-card/planet-card.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Planet } from '../../interfaces/planet.interface';
import { FavoritesService } from '../../services/favorites.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-planet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlanetCardComponent],
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss'],
  animations: [
    // Animación para la lista
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger('60ms', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'translateY(0)' })
            )
          ])
        ], { optional: true }),
        // Animación al reordenar
        query(':leave', [
          stagger('60ms', [
            animate('400ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 0, transform: 'translateY(30px)' })
            )
          ])
        ], { optional: true })
      ])
    ]),
    // Animación para cada tarjeta
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', 
          style({ opacity: 1, transform: 'scale(1)' })
        )
      ])
    ])
  ]
})
export class PlanetListComponent implements OnInit {
  private planetService = inject(PlanetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);

  planets = signal<Planet[]>([]); // Lista de planetas
  searchQuery = signal(''); // Búsqueda
  sortOrder = signal<'asc' | 'desc'>('asc'); // Orden
  currentPage = signal(1); // Página actual
  readonly itemsPerPage = 5; // Elementos por página
  currentSort = '';
  isLoading = signal(true); // Nueva señal para el estado de carga

  sortOptions = [
    { label: 'Nombre', value: 'name' },
    { label: 'Masa', value: 'mass' },
    { label: 'Densidad', value: 'density' }
  ];

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
      next: (data) => {
        this.planets.set(data); // Carga planetas
        this.isLoading.set(false); // Desactiva el estado de carga
      },
      error: (err) => {
        console.error('Error loading planets:', err);
        this.isLoading.set(false); // Desactiva el estado de carga en caso de error
      }
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
    this.planets.update(planets => [...planets].reverse()); // Invierte orden con animación
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

  sortPlanets(criteria: string) {
    this.currentSort = criteria;
    // Animación suave al reordenar
    this.planets.update(planets => [...planets].sort((a, b) => {
      switch (criteria) {
        case 'name': return a.name.localeCompare(b.name);
        case 'mass': return (a.mass?.massValue || 0) - (b.mass?.massValue || 0);
        case 'density': return (a.density || 0) - (b.density || 0);
        default: return 0;
      }
    }));
  }
}
