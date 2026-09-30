import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SessionTimeoutService } from '@pure-tools/babetka';
import { App } from './app';
import { AuthService } from './services/auth.service';

describe('App', () => {
  const isAuthenticated = signal(false);
  const mockTimeout = { start: vi.fn(), stop: vi.fn() };

  beforeEach(async () => {
    vi.clearAllMocks();
    isAuthenticated.set(false);
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isAuthenticated } },
        { provide: SessionTimeoutService, useValue: mockTimeout },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('stops session timeout when logged out', () => {
    TestBed.createComponent(App);
    TestBed.tick();
    expect(mockTimeout.stop).toHaveBeenCalled();
    expect(mockTimeout.start).not.toHaveBeenCalled();
  });

  it('starts session timeout when logged in', () => {
    TestBed.createComponent(App);
    isAuthenticated.set(true);
    TestBed.tick();
    expect(mockTimeout.start).toHaveBeenCalled();
  });
});
