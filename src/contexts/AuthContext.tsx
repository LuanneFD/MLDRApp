import { UserDTO } from "@dtos/UserDTO";
import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "@services/api";
import { storageUserSave, storageUserGet, storageUseRemove } from "@storage/storage.user";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut : () => Promise<void>;
    isLoadingStorageData: boolean;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);


export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingStorageData, setIsLoadingStorageData] = useState(true);

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/users/login', { email, password });

            if (data.id) {
                setUser(data);
                storageUserSave(data);
            }
        }
        catch (error) {
            throw error;
        }
    }

    async function signOut() {
        try {
            setIsLoadingStorageData(true);
            setUser({} as UserDTO);
            await storageUseRemove();
        }
        catch (error) {
            throw (error);
        }
        finally {
            setIsLoadingStorageData(false);
        }
    }

    async function loadUserData() {
        try {
            const userLogged = await storageUserGet();
            if (userLogged) {
                setUser(userLogged);
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            setIsLoadingStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn,signOut, isLoadingStorageData }}>
            {children}
        </AuthContext.Provider>
    )
}