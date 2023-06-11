import { Songs } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/dist/client/components/headers";

const getSongs = async(): Promise<Songs[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: true });

    if (error) {
        console.log(error);
    }

    return (data as any) || [];
}

export default getSongs;