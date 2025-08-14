import { animate, group, query, style, transition, trigger } from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set a default style for enter and leave
    query(':enter, :leave', [
      style({
        position: 'absolute',
        width: '100%',
        top: 0,
        left: 0,
        opacity: 1,
      })
    ], { optional: true }),
    // Animate leave page
    query(':leave', [
      style({ opacity: 1, transform: 'translateY(0%)' }),
      animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 0, transform: 'translateY(20px)' }))
    ], { optional: true }),
    // Animate enter page
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-20px)' }),
      animate('350ms cubic-bezier(0.4,0,0.2,1)', style({ opacity: 1, transform: 'translateY(0%)' }))
    ], { optional: true })
  ])
]);
