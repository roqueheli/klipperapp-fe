import httpInternalApi from "@/lib/common/http.internal.service";
import { User } from "@/types/user";

const userCache = new Map<string, User>();

export const getUserById = async (id: number, useCache = true): Promise<User> => {
    const key = id.toString();

    if (useCache && userCache.has(key)) {
        return userCache.get(key)!;
    }

    const response = await httpInternalApi.httpGetPublic<User>(`/users/${id}`);

    if (!response) {
        throw new Error(`User with id ${id} not found`);
    }

    const user = response;

    if (useCache) {
        userCache.set(key, user);
    }

    return user;
};

export const clearUserCache = () => userCache.clear();
