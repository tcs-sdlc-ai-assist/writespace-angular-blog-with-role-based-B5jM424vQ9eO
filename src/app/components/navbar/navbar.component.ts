import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { AvatarComponent } from '../avatar/avatar.component';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AvatarComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isDropdownOpen = false;
  displayName = '';
  userRole: 'admin' | 'user' = 'user';

  private sessionSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionSub = this.authService.session$.subscribe((session: Session | null) => {
      if (session) {
        this.displayName = session.displayName;
        this.userRole = session.role;
      } else {
        this.displayName = '';
        this.userRole = 'user';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sessionSub) {
      this.sessionSub.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isDropdownOpen = false;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.isDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}