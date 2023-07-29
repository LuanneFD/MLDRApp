import { UserDTO } from "@dtos/UserDTO";
import { ReactNode, createContext, useEffect, useState } from "react";
import { api } from "@services/api";
import { storageUserSave, storageUserGet } from "@storage/storage.user";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);


export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);

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

    async function loadUserData() {
        const userLogged = await storageUserGet();
        if (userLogged) {
            setUser(userLogged);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}