import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  imports: [CommonModule],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
})
export class StarRating {
  private ratingSignal = signal(0);
  @Input() set rating(value: number) {
    this.ratingSignal.set(value || 0);
  }
  @Input() count?: number;
  @Input() size: 'sm' | 'md' = 'sm';

  stars = computed(() => {
    const rounded = Math.round(this.ratingSignal() * 2) / 2;
    return [1, 2, 3, 4, 5].map((position) => {
      if (rounded >= position) return 'full';
      if (rounded + 0.5 === position) return 'half';
      return 'empty';
    });
  });

  displayRating = computed(() => this.ratingSignal().toFixed(1));
}
