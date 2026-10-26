import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

const USERS_KEY = 'skillboard_users';    // Tous les comptes inscrits
const SESSION_KEY = 'skillboard_user';   // L'utilisateur connecté actuellement

// Récupère tous les utilisateurs inscrits
const getUsers = () => {
    try {
        const saved = localStorage.getItem(USERS_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

// Sauvegarde la liste des utilisateurs
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }) {
    // On restaure la session depuis le localStorage
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Connexion : vérifie email + mot de passe
    const login = useCallback((email, password) => {
        const users = getUsers();
        console.log('users en storage:', users);
        console.log('tentative:', JSON.stringify(email), JSON.stringify(password));

        const found = users.find(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
        );
        console.log('trouvé:', found);

        if (!found) {
            return { success: false, error: 'Email ou mot de passe incorrect.' };
        }

        const session = { email: found.email, name: found.name };
        setUser(session);
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { success: true };
    }, []);

    // Inscription : crée un nouvel utilisateur
    const register = useCallback((name, email, password) => {
        const users = getUsers();
        const cleanEmail = email.trim().toLowerCase();

        // Vérification : l'email existe déjà ?
        if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
            return { success: false, error: 'Un compte existe déjà avec cet email.' };
        }

        // Vérification : mot de passe assez long
        if (password.length < 4) {
            return { success: false, error: 'Le mot de passe doit contenir au moins 4 caractères.' };
        }

        // Création du compte
        const newUser = { name: name.trim(), email: cleanEmail, password };
        saveUsers([...users, newUser]);

        // Connexion automatique après inscription
        const session = { email: newUser.email, name: newUser.name };
        setUser(session);
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { success: true };
    }, []);

    // Déconnexion : on retire juste la session (les comptes restent)
    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    }, []);

    // Suppression du compte : on retire le compte ET la session
    const deleteAccount = useCallback(() => {
        if (!user) return;
        const users = getUsers().filter(
            (u) => u.email.toLowerCase() !== user.email.toLowerCase()
        );
        saveUsers(users);
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    }, [user]);

    const value = useMemo(
        () => ({ user, login, register, logout, deleteAccount }),
        [user, login, register, logout, deleteAccount]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);