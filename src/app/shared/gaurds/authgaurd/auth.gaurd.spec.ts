import { TestBed } from '@angular/core/testing';

import { AuthGuard} from './auth.gaurd';

describe('AuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthGuard = TestBed.get(AuthGuard);
    expect(service).toBeTruthy();
  });
});
