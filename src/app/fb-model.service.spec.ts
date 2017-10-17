import { TestBed, inject } from '@angular/core/testing';

import { FbModelService } from './fb-model.service';

describe('FbModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FbModelService]
    });
  });

  it('should be created', inject([FbModelService], (service: FbModelService) => {
    expect(service).toBeTruthy();
  }));
});
