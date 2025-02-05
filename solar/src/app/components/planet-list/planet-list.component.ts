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

  planets = signal<Planet[]>([]);
  searchQuery = signal('');
  sortOrder = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);
  readonly itemsPerPage = 5;

  filteredPlanets = computed(() => {
    return this.planets()
      .filter(planet => 
        planet.name.toLowerCase().includes(this.searchQuery().toLowerCase())
      )
      .sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return this.sortOrder() === 'asc' ? comparison : -comparison;
      })
      .slice(
        (this.currentPage() - 1) * this.itemsPerPage,
        this.currentPage() * this.itemsPerPage
      );
  });

  totalPages = computed(() => {
    const filtered = this.planets().filter(planet => 
      planet.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
    const total = Math.ceil(filtered.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  ngOnInit() {
    this.loadPlanets();
    this.syncUrlParams();
  }

  private loadPlanets() {
    this.planetService.getPlanets().subscribe({
      next: (data) => this.planets.set(data),
      error: (err) => console.error('Error loading planets:', err)
    });
  }

  private syncUrlParams() {
    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['sort']) this.sortOrder.set(params['sort']);
      if (params['page']) this.currentPage.set(Number(params['page']));
    });
  }

  updateSearch(value: string) {
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.updateUrlParams();
  }

  toggleSort() {
    this.sortOrder.update(current => current === 'asc' ? 'desc' : 'asc');
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
      queryParamsHandling: 'merge'
    });
  }
}