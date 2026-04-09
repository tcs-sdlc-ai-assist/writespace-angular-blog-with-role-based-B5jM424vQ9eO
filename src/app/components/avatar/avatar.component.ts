import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div
      class="avatar-container"
      [class.avatar-admin]="role === 'admin'"
      [class.avatar-user]="role !== 'admin'"
      [attr.title]="displayName || (role === 'admin' ? 'Admin' : 'User')"
    >
      <span class="avatar-emoji">{{ role === 'admin' ? '👑' : '📖' }}</span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .avatar-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 1.2rem;
      user-select: none;
      flex-shrink: 0;
    }

    .avatar-admin {
      background-color: #7c3aed;
    }

    .avatar-user {
      background-color: #4f46e5;
    }

    .avatar-emoji {
      line-height: 1;
    }
  `]
})
export class AvatarComponent {
  @Input() role: string = 'user';
  @Input() displayName?: string;
}