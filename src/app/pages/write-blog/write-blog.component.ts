import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-write-blog',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.css']
})
export class WriteBlogComponent implements OnInit {
  blogForm!: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  private postId: string = '';
  private session: Session | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.postId = idParam;
      this.loadPost();
    }
  }

  private loadPost(): void {
    const posts = this.storageService.getPosts();
    const post = posts.find(p => p.id === this.postId);

    if (!post) {
      this.router.navigate(['/blogs']);
      return;
    }

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    const isOwner = post.authorId === this.session.userId;
    const isAdmin = this.session.role === 'admin';

    if (!isOwner && !isAdmin) {
      this.router.navigate(['/blogs']);
      return;
    }

    this.blogForm.patchValue({
      title: post.title,
      content: post.content
    });
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    if (!this.session) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const { title, content } = this.blogForm.value;

    try {
      if (this.isEditMode) {
        const posts = this.storageService.getPosts();
        const existingPost = posts.find(p => p.id === this.postId);

        if (!existingPost) {
          this.errorMessage = 'Post not found.';
          this.isSubmitting = false;
          return;
        }

        const isOwner = existingPost.authorId === this.session.userId;
        const isAdmin = this.session.role === 'admin';

        if (!isOwner && !isAdmin) {
          this.router.navigate(['/blogs']);
          return;
        }

        const updatedPost: Post = {
          ...existingPost,
          title,
          content
        };

        this.storageService.updatePost(updatedPost);
      } else {
        const newPost: Post = {
          id: 'post-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9),
          title,
          content,
          createdAt: new Date().toISOString(),
          authorId: this.session.userId,
          authorName: this.session.displayName
        };

        this.storageService.addPost(newPost);
      }

      this.router.navigate(['/blogs']);
    } catch (_error: unknown) {
      this.errorMessage = 'Failed to save post. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/blogs']);
  }
}