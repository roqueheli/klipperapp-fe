import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getRoleByName, clearRoleCache } from './roleUtils';
import httpInternalApi from '@/lib/common/http.internal.service';
import { Role } from '@/types/role';

// Mock the httpInternalApi module
vi.mock('@/lib/common/http.internal.service', () => ({
  default: {
    httpGetPublic: vi.fn(),
  },
}));

describe('roleUtils', () => {
  const mockRole: Role = {
    id: 1,
    name: 'admin',
    permissions: [],
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    // Clear the cache before each test
    clearRoleCache();
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original mocks after each test
    vi.restoreAllMocks();
  });

  describe('getRoleByName', () => {
    it('should fetch and return a role by name (no cache)', async () => {
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });

      const role = await getRoleByName('admin');

      expect(role).toEqual(mockRole);
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledWith('/roles', expect.any(URLSearchParams));
    });

    it('should return a role from cache if available', async () => {
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });

      // First call to populate cache
      await getRoleByName('admin');
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);

      // Second call, should use cache
      const roleFromCache = await getRoleByName('admin');

      expect(roleFromCache).toEqual(mockRole);
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1); // Should not be called again
    });

    it('should throw an error if role is not found', async () => {
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [] });

      await expect(getRoleByName('nonexistent')).rejects.toThrow('No se encontró el rol con nombre: nonexistent');
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if API call fails', async () => {
      const errorMessage = 'Network error';
      (httpInternalApi.httpGetPublic as vi.Mock).mockRejectedValueOnce(new Error(errorMessage));

      await expect(getRoleByName('admin')).rejects.toThrow('Error al obtener el rol admin');
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);
    });

    it('should fetch role even if useCache is false', async () => {
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });

      // Call with useCache = false
      const role = await getRoleByName('admin', false);

      expect(role).toEqual(mockRole);
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);

      // Call again, should fetch again because cache was not used
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });
      await getRoleByName('admin', false);
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearRoleCache', () => {
    it('should clear the role cache', async () => {
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });

      // Populate cache
      await getRoleByName('admin');
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(1);

      clearRoleCache();

      // Call again, should fetch because cache is cleared
      (httpInternalApi.httpGetPublic as vi.Mock).mockResolvedValueOnce({ roles: [mockRole] });
      await getRoleByName('admin');
      expect(httpInternalApi.httpGetPublic).toHaveBeenCalledTimes(2);
    });
  });
});
