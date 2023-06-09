import { User } from "@supabase/auth-helpers-nextjs";
import { Subscription, UserDetails } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import {
  useSessionContext,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propsName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase,
  } = useSessionContext();

  const user = useSupabaseUser();
  const accessToken = session?.access_token ?? null;
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscritpion] = useState<Subscription | null>(null);

  const getUserDeatails = () =>
    supabase
      .from("users")
      .select("*")
      .single();

      const getSubscription = () =>
      supabase
        .from("subscriptions")
        .select("*, prices(*, products(*))")
        .in("status", ["traialing", "active"])
        .single();

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);
            Promise.allSettled([getUserDeatails(), getSubscription()]).then((result) => {
                const userDetailsPromise = result[0];
                const subscriptionPromise = result[1];

                if (userDetailsPromise.status === "fulfilled") {
                    setUserDetails(userDetailsPromise.value.data as UserDetails);
                }

                if (subscriptionPromise.status === "fulfilled") {
                    setSubscritpion(subscriptionPromise.value.data as Subscription);
                }

                setIsLoadingData(false);
            })
        }else if (!user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);
            Promise.allSettled([getUserDeatails(), getSubscription()]).then((result) => {
                const userDetailsPromise = result[0];
                const subscriptionPromise = result[1];

                if (userDetailsPromise.status === "fulfilled") {
                    setUserDetails(userDetailsPromise.value.data as UserDetails);
                }

                if (subscriptionPromise.status === "fulfilled") {
                    setSubscritpion(subscriptionPromise.value.data as Subscription);
                }

                setIsLoadingData(false);
            })
        } else if (!user && !isLoadingData && isLoadingUser) {
            setUserDetails(null);
            setSubscritpion(null);
        }
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails, 
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error(`useUser must be used within a MyUserContextProvider.`);
    }
    return context;
  };