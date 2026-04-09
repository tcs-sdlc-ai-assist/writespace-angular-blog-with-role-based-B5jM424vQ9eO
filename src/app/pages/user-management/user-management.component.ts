import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { UserRowComponent } from '../../components/user-row/user-row.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { User } from '../../models/user.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, UserRowComponent, RouterLink, DatePipe, TitleCasePipe, NgClass],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  createUserForm!: FormGroup;
  users: User[] = [];
  roles: string[] = ['admin', 'user'];
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  formError: string = '';
  currentUserId: string = '';

  confirmDeleteUserId: string | null = null;
  confirmDeleteUserName: string = '';

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const session: Session | null = this.authService.getSession();
    if (session) {
      this.currentUserId = session.userId;
    }

    this.createUserForm = this.fb.group({
      displayName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]]
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    try {
      this.users = this.storageService.getUsers();
    } catch {
      this.users = [];
    } finally {
      this.isLoading = false;
    }
  }

  onCreateUser(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.formError = '';

    const { displayName, username, password, role } = this.createUserForm.value;

    if (username === 'admin') {
      this.formError = 'Username "admin" is not allowed.';
      this.isSubmitting = false;
      return;
    }

    const existingUsers = this.storageService.getUsers();
    const duplicate = existingUsers.find((u: User) => u.username === username);
    if (duplicate) {
      this.formError = 'Username is already taken. Please choose another.';
      this.isSubmitting = false;
      return;
    }

    const newUser: User = {
      id: 'user-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
      displayName,
      username,
      password,
      role,
      createdAt: new Date().toISOString()
    };

    try {
      this.storageService.addUser(newUser);
      this.createUserForm.reset({ displayName: '', username: '', password: '', role: '' });
      this.loadUsers();
    } catch {
      this.formError = 'Failed to create user. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  onEditUser(_userId: string): void {
    // Edit functionality placeholder — not required for MVP
  }

  onDeleteUser(userId: string): void {
    const user = this.users.find((u: User) => u.id === userId);
    if (!user) {
      return;
    }

    if (user.id === 'admin' || user.username === 'admin') {
      return;
    }

    if (user.id === this.currentUserId) {
      return;
    }

    this.confirmDeleteUserId = userId;
    this.confirmDeleteUserName = user.displayName;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteUserId) {
      return;
    }

    try {
      this.storageService.deleteUser(this.confirmDeleteUserId);
      this.loadUsers();
    } catch {
      // silently fail
    } finally {
      this.confirmDeleteUserId = null;
      this.confirmDeleteUserName = '';
    }
  }

  cancelDelete(): void {
    this.confirmDeleteUserId = null;
    this.confirmDeleteUserName = '';
  }
}